import os
import glob

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'projects-backend.mlqyyh.easypanel.host' in content:
        new_content = content.replace('projects-backend.mlqyyh.easypanel.host', 'projects-backend.mlqyyh.easypanel.host')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Replaced in {filepath}")

def main():
    search_path = 'c:/Users/Usuario/Desktop/Projects/setupdream/frontend/src/**/*.ts*'
    for filepath in glob.glob(search_path, recursive=True):
        replace_in_file(filepath)
        
    search_path = 'c:/Users/Usuario/Desktop/Projects/setupdream/frontend/src/**/*.tsx*'
    for filepath in glob.glob(search_path, recursive=True):
        replace_in_file(filepath)

if __name__ == '__main__':
    main()
