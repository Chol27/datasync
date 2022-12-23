## midterm project optimization for data sync

This project is try to optimize speed and network load in data transfer.

The experiment example is psuedo-discord which users could send only text messages, update and delete their messages.

The problem is to optimize speed and network load in data transfer when the user syncing new message to their device.

For implementation details you could visit `report_Chonlakorn.pdf` or `Midterm Presentation.pdf`

## How to run

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
