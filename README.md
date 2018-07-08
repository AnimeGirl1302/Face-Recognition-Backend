THIS IS THE BACKEND PART OF FACE RECOGNITION APP.
DATABASE IS CREATED USING POSTGRES.
contains 2 tables 
TABLES 
 1. USER                                       Table "public.users"
 Column  |            Type             | Collation | Nullable |              Default
---------+-----------------------------+-----------+----------+-----------------------------------
 id      | integer                     |           | not null | nextval('usegrs_id_seq'::regclass)
 name    | character varying(100)      |           |          |
 email   | text                        |           | not null |
 entries | bigint                      |           |          | 0
 joined  | timestamp without time zone |           | not null |
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
    "users_email_key" UNIQUE CONSTRAINT, btree (email)



2. LOGIN 
                                       Table "public.login"
 Column |          Type          | Collation | Nullable |              Default
--------+------------------------+-----------+----------+-----------------------------------
 id     | integer                |           | not null | nextval('login_id_seq'::regclass)
 hash   | character varying(100) |           | not null |
 email  | text                   |           | not null |
Indexes:
    "login_pkey" PRIMARY KEY, btree (id)
    "login_email_key" UNIQUE CONSTRAINT, btree (email)    