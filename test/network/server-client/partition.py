import requests
import sys
from urllib.parse import urljoin
from joblib import Parallel, delayed
import numpy as np

# baseUrl = 'http://localhost:4000/api/messages/test2/'
# partitionUrl = 'http://localhost:4000/api/messages/partition/'

baseUrl = 'http://172.31.2.38:4000/api/messages/test2/'
partitionUrl = 'http://172.31.2.38:4000/api/messages/partition/'

def send_partition_req(partition):
    url = urljoin(partitionUrl,str(partition['skip']) + '/' +  str(partition['take']))
    return requests.get(url).json()

if len(sys.argv) < 3:
        print('usage: python3 partition.py partitionSize maxSize')
        quit()
response = requests.get(urljoin(baseUrl, sys.argv[1]) + '/' + sys.argv[2]).json()


if 'partitionSets' in response:
    partition_sets = response['partitionSets']
    # print('ps', partition_sets)
    allres = []
    for ps in partition_sets:
        # print('ps', ps)
        results = Parallel(n_jobs=len(ps))(delayed(send_partition_req)(ps[i]) for i in range(len(ps)))
        # print('done')
        allres += results
    arr = np.array(results)
    arr = arr.reshape(arr.shape[0]*arr.shape[1])
    # print(arr.shape)

    