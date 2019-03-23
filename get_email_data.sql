select
    email,
    IF(
        count(*) < 3,
        GROUP_CONCAT(REPLACE(name, 'PLUS ONE', 'guest') separator ' and '),
        'FAMILY'
    ) as addressee
from guests
where 1=1
    and priority = '1'
    and email <> ''
group by
    email
