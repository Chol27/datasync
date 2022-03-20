import sqlite3
from sqlite3 import Error
import sys
import requests
from urllib.parse import urljoin
import numpy as np
import pandas as pd

baseUrl = 'http://localhost:4000/api/messages/'

def create_connection(db_file):
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except Error as e:
        print(e)

    return conn

def online_and_update(filename, latestActionId):
    dff = pd.read_csv(filename)
    dff = dff.set_index('createActionId')
    # latest = str(dff.index[-1])
    response = requests.get(urljoin(baseUrl, str(latestActionId))).json()
    message = pd.DataFrame(response['message'])
    if 'createActionId' in message.columns:
        message = message.set_index('createActionId')
    dff = pd.concat([dff, message])
    batch = response['batch']
    for batch_type in batch:
        updated_value = pd.DataFrame(batch[batch_type])
        print('batch',batch_type, len(updated_value))
        if 'messageCreateActionId' in updated_value.columns:
            updated_value = updated_value.set_index('messageCreateActionId')
            index = updated_value.index
            dff.loc[index, batch_type] = updated_value.loc[:, 'updatedValue']
    deletedCreateActionIds = response['deletedCreateActionIds']
    dff = dff.drop(deletedCreateActionIds, errors='ignore')
    response = requests.get(baseUrl).json()
    dff2 = pd.DataFrame(response['message'])
    dff2 = dff2.set_index('createActionId')
    print('dff', dff.shape)
    print('dff2', dff2.shape)
    print('Compare result:', ((dff == dff2).all().sum() == 4))
    dff.to_csv(filename)
    return response['newLatestActionId']

def fetch_whole_data(filename):
    response = requests.get(baseUrl).json()
    dff = pd.DataFrame(response['message'])
    dff = dff.set_index('createActionId')
    dff.to_csv(filename)
    return response['newLatestActionId']

def fetch_appdata_by_filename(conn, filename):
    cur = conn.cursor()
    cur.execute(f"SELECT * FROM appdata WHERE filename='{filename}' LIMIT 1")

    datalist = cur.fetchall()
    if len(datalist) == 1:
        latestActionId = datalist[0][1]
        print('old', latestActionId)
        newLatest = online_and_update(filename, latestActionId)
        print('new', newLatest)
        cur.execute(f"UPDATE appdata SET latestAction={newLatest} WHERE filename='{filename}'")

    else:
        newLatest = fetch_whole_data(filename)
        print('new', newLatest)
        cur.execute(f"INSERT INTO appdata (filename, latestAction) VALUES ('{filename}', '{newLatest}')")

def main():
    database = r"appdata.db"
    if len(sys.argv) < 2:
        print('usage: python3 online.py filename.csv')
        quit()
    filename = sys.argv[1]

    # create a database connection
    conn = create_connection(database)
    with conn:
        fetch_appdata_by_filename(conn, filename)

if __name__ == '__main__':
    main()