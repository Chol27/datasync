import sqlite3
from sqlite3 import Error
import sys
import requests
from joblib import Parallel, delayed
from urllib.parse import urljoin
import pandas as pd


# baseUrl = 'http://localhost:4000/api/messages/'
# partitionUrl = 'http://localhost:4000/api/messages/partition/'


baseUrl = 'http://172.31.2.38/api/messages/'
partitionUrl = 'http://172.31.2.38:4000/api/messages/partition/'

def create_connection(db_file):
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except Error as e:
        print(e)

    return conn

def save_to_csv(df, filename):
    indexer, datas = df['createActionId'], df.drop(['createActionId'], axis=1)
    indexer.to_csv('indexer.' + filename, index=False)
    datas.to_csv(filename, index=False)
    return

def check_result(df):
    # print('checking',)
    df2, _ = fetch_whole()
    df2 = df2.set_index('createActionId')
    # print('df', df.shape)
    # print('df2', df2.shape)
    # print('Compare result:', ((df == df2).all().sum() == 4))


def online_and_update(filename, latestActionId):
    dff = pd.read_csv(filename)
    indexer = pd.read_csv('indexer.' + filename)
    # print('indexer', indexer)
    dff = dff.set_index(indexer['createActionId'])
    # print('dff', dff)
    # latest = str(dff.index[-1])
    response = requests.get(urljoin(baseUrl, str(latestActionId))).json()
    # print('whe', response['message'])
    message = pd.DataFrame(response['message'])
    if 'createActionId' in message.columns:
        message = message.set_index('createActionId')
    dff = pd.concat([dff, message])
    batch = response['batch']
    for batch_type in batch:
        updated_value = pd.DataFrame(batch[batch_type])
        # print('batch',batch_type, len(updated_value))
        if 'messageCreateActionId' in updated_value.columns:
            updated_value = updated_value.set_index('messageCreateActionId')
            index = updated_value.index
            dff.loc[index, batch_type] = updated_value.loc[:, 'updatedValue']
    deletedCreateActionIds = response['deletedCreateActionIds']
    dff = dff.drop(deletedCreateActionIds, errors='ignore')

    check_result(dff)    

    save_to_csv(dff.reset_index(), filename)
    return response['newLatestActionId']

def send_partition_req(partition):
    url = urljoin(partitionUrl,str(partition['skip']) + '/' +  str(partition['take']))
    return requests.get(url).json()


def fetch_whole():
    response = requests.get(baseUrl).json()
    if 'partitionSets' in response:
        partition_sets = response['partitionSets']
        # print('ps', partition_sets)
        allres = []
        for ps in partition_sets:
            # print('ps', ps)
            results = Parallel(n_jobs=len(ps))(delayed(send_partition_req)(ps[i]) for i in range(len(ps)))
            for item in results:
                allres += item
            # print('done')
        # arr = np.array(results)
        # arr = arr.reshape(arr.shape[0]*arr.shape[1])
        dff = pd.DataFrame(allres)
        # print(dff.head())
    else:
        dff = pd.DataFrame(response['message'])
    return dff, response['newLatestActionId']

def fetch_and_get_latest_id(filename):
    dff, newLatestActionId = fetch_whole()
    save_to_csv(dff, filename)
    return newLatestActionId

def fetch_appdata_by_filename(conn, filename):
    cur = conn.cursor()
    cur.execute(f"SELECT * FROM appdata WHERE filename='{filename}' LIMIT 1")

    datalist = cur.fetchall()
    if len(datalist) == 1:
        latestActionId = datalist[0][1]
        # print('old', latestActionId)    
        newLatest = online_and_update(filename, latestActionId)
        # print('new', newLatest)
        cur.execute(f"UPDATE appdata SET latestAction={newLatest} WHERE filename='{filename}'")

    else:
        newLatest = fetch_and_get_latest_id(filename)
        # print('new', newLatest)
        cur.execute(f"INSERT INTO appdata (filename, latestAction) VALUES ('{filename}', '{newLatest}')")

def main():
    database = r"appdata.db"
    if len(sys.argv) < 2:
        # print('usage: python3 online.py filename.csv')
        quit()
    filename = sys.argv[1]

    # create a database connection
    conn = create_connection(database)
    with conn:
        fetch_appdata_by_filename(conn, filename)

if __name__ == '__main__':
    main()