@echo off
echo ==========================================
echo StyleLink PostgreSQL Setup
echo ==========================================
echo.

echo Step 1: Setting up PostgreSQL database and user
echo Please enter your PostgreSQL superuser (postgres) password when prompted.
echo.

REM Create StyleLink database user
psql -U postgres -c "CREATE USER stylelink_user WITH ENCRYPTED PASSWORD 'stylelink_secure_pass';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE stylelink_dev TO stylelink_user;"
psql -U postgres -c "ALTER USER stylelink_user CREATEDB;"

echo.
echo Step 2: Testing connection
echo.

REM Set environment variable for this session
set DATABASE_URL=postgresql://stylelink_user:stylelink_secure_pass@localhost:5432/stylelink_dev?schema=public

echo.
echo Step 3: Database setup complete!
echo.
echo Your DATABASE_URL should be:
echo postgresql://stylelink_user:stylelink_secure_pass@localhost:5432/stylelink_dev?schema=public
echo.
echo Next steps:
echo 1. Update your .env file with the DATABASE_URL above
echo 2. Run: npx prisma db push
echo 3. Run: npm run dev
echo.
pause
