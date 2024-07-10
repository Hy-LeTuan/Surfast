import os
import glob

# Get the list of all migration files except __init__.py
migration_files = glob.glob('*/migrations/*.py')
migration_files = [f for f in migration_files if not f.endswith('__init__.py')]

# Delete each file
for file_path in migration_files:
    os.remove(file_path)
    print(f"Deleted: {file_path}")

# Delete all .pyc files in migrations folders
pyc_files = glob.glob('*/migrations/*.pyc')
for file_path in pyc_files:
    os.remove(file_path)
    print(f"Deleted: {file_path}")
