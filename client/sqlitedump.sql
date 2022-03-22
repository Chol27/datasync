PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE appdata(filename varchar, latestAction int);
COMMIT;
