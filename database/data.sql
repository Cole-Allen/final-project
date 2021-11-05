INSERT into
  "users"
  (
    "firstName",
    "lastName",
    "password",
    "email"
  )
  values
  (
    'Tom',
    'Bombadil',
    '$argon2i$v=19$m=4096,t=3,p=1$7p3plZolH1mTyh4HEMSLYA$/KzrlhByZRc0tqGCo8AXWkcPyRL7DiLWtFUWL2dM9JY',
    'tombombadil@lotr.com'
  )

-- INSERT into
--   "history"
--   (
--     "userId",
--     "date",
--     "weight"
--   )
--   values
--   (
--     '1',
--     '10-10-10',
--     '201'
--   )
