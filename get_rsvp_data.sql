select
    CONCAT('"', TRIM(LOWER(email)), '":["', GROUP_CONCAT(TRIM(name) separator '","') , '"],') as '{'
from guests
where 1=1
    and priority = '1'
    and email <> ''
group by
    email

union

select '}'
from guests
