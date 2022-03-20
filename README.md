## midterm project optimization for data sync

to run this in your local server you can run

`source .setup`

#

For database there are some shorthand provided in database folder by run

`source .source`

then you will got following command alias

`list-state` which would list all dump file we have in `seed-data` folder

`save-state arg` and `load-state arg` which would save and load dump file

`set-index` which would set cluster index you can edit in `index.sql`

#

In client you can run `python3 mock.py` which would insert data from `seed.csv`

Please note that this is uncompletely version so you need to load `init.sql` everytimes you end this client and want to use again.

For client using in baseline test you can run `python3 online.py {filename.csv}` 
