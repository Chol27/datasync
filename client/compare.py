from operator import length_hint
from webbrowser import MacOSX
from numpy import mat
import pandas as pd

f1 = pd.read_csv('a.csv')
f2 = pd.read_csv('b.csv')

if len(f1) != len(f2):
    print('length not equal')

else:
    index = (f1 != f2)
    index = index[index == True].sum(axis=1)
    index = index[index != 0]
    print(index.index)
    it = 0
    print('ff', f1.iloc[220])
    print('ff', f2.iloc[220])
    # for i in index.index:
    #     print(it)
    #     print(f1[i])
    #     print(f2[i])
        # print('#############')
    
