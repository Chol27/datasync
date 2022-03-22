# For test if number of connection affect the performance

echo 10000 >> dbtime.txt
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/10000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/10000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/10000 ;} 2>> dbtime.txt
sleep 10

echo 20000 >> dbtime.txt
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/20000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/20000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/20000 ;} 2>> dbtime.txt
sleep 10

echo 30000 >> dbtime.txt
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/30000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/30000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/30000 ;} 2>> dbtime.txt
sleep 10

echo 40000 >> dbtime.txt
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/40000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/40000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/40000 ;} 2>> dbtime.txt
sleep 10

echo 50000 >> dbtime.txt
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/50000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/50000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/50000 ;} 2>> dbtime.txt
sleep 10

echo 60000 >> dbtime.txt
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/60000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/60000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/60000 ;} 2>> dbtime.txt
sleep 10

echo 70000 >> dbtime.txt
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/70000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/70000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/70000 ;} 2>> dbtime.txt
sleep 10

echo 80000 >> dbtime.txt
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/80000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/80000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/80000 ;} 2>> dbtime.txt
sleep 10

echo 90000 >> dbtime.txt
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/90000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/90000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/90000 ;} 2>> dbtime.txt
sleep 10

echo 100000 >> dbtime.txt
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/100000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/100000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/100000 ;} 2>> dbtime.txt
sleep 10

echo 125000 >> dbtime.txt
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/125000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/125000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/125000 ;} 2>> dbtime.txt
sleep 10

echo 150000 >> dbtime.txt
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/150000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/150000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/150000 ;} 2>> dbtime.txt
sleep 10

echo 175000 >> dbtime.txt
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/175000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/175000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/175000 ;} 2>> dbtime.txt
sleep 10

echo 200000 >> dbtime.txt
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/200000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/200000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/200000 ;} 2>> dbtime.txt
sleep 10

echo 250000 >> dbtime.txt
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/250000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/250000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/250000 ;} 2>> dbtime.txt
sleep 10

echo 300000 >> dbtime.txt
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/300000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/300000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/300000 ;} 2>> dbtime.txt
sleep 10

echo 350000 >> dbtime.txt
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/350000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/350000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/350000 ;} 2>> dbtime.txt
sleep 10

echo 400000 >> dbtime.txt
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/400000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/400000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/400000 ;} 2>> dbtime.txt
sleep 10

echo 450000 >> dbtime.txt
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/450000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/450000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/450000 ;} 2>> dbtime.txt
sleep 10

echo 500000 >> dbtime.txt
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/500000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/500000 ;} 2>> dbtime.txt
sleep 10
{ time curl -o /dev/null http://172.31.2.38:4000/api/messages/test/500000 ;} 2>> dbtime.txt
sleep 10