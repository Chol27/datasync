import requests
from urllib.parse import urljoin
import numpy as np
import pandas as pd

baseUrl = 'http://localhost:4000/api/messages/'

df = pd.read_csv('seed.csv')

df.iloc[:10000].to_csv('s.csv')

start = 0
end = 0
latest = 0
user_latest = 0
insert_id = 0
while True:
    print('latest', latest)
    print('user_latest', user_latest)
    method = input('method:')
    size = int(input('size:'))

    if method == 'create':
        latest += size
        end += size
        print('insert', insert_id)
        print('to', insert_id + size)
        for i in range(insert_id, insert_id + size):
            requests.post(baseUrl, data=df.iloc[i].to_dict())
        insert_id += size
        continue

    if method == 'update':
        latest += size
        author = 0
        message = 0
        r3 = 0
        select = np.random.choice(np.arange(start, end), size, replace=False)
        for row in select:
            data = df.iloc[row]
            uuid = data['uuid']
            obj = data[['author', 'message', 'likes']].to_dict()
            if row%3 == 0:
                obj['author'] = 'updatedAuthor' + str(author)
                author += 1
            elif row%3 == 1:
                obj['message'] = 'updatedMessage' + str(message)
                message += 1
            else:
                obj['likes'] = int(obj['likes']) + 5
            requests.put(urljoin(baseUrl, uuid), data=obj)

    if method == 'delete':
        delete_random_size = int(input('delete amount:'))
        select = np.random.choice(np.arange(start, start + delete_random_size), size, replace=False)
        latest += size
        for row in range(start, size):
            uuid = df.iloc[row]['uuid']
            requests.delete(urljoin(baseUrl, uuid))
        start += delete_random_size

    if method == 'getAll':
        user_latest = latest
        response = requests.get(baseUrl).json()
        dff = pd.DataFrame(response['message'])
        dff = dff.set_index('createActionId')
        dff.to_csv(input('filename:'))
        
    if method == 'get':
        fn = input('update to:')
        dff = pd.read_csv(fn)
        dff = dff.set_index('createActionId')
        # latest = str(dff.index[-1])
        response = requests.get(urljoin(baseUrl, str(user_latest))).json()
        user_latest = latest
        message = pd.DataFrame(response['message'])
        print('message', message.shape)
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
        
        dff.to_csv(fn)