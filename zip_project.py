import os
import zipfile

def zipdir(path, ziph):
    for root, dirs, files in os.walk(path):
        # Exclude heavy dependencies and cache folders
        dirs[:] = [d for d in dirs if d not in ['node_modules', '__pycache__', '.git', '.cache', 'dist', 'build']]
        for file in files:
            if not file.endswith('.zip') and not file == 'zip_project.py':
                file_path = os.path.join(root, file)
                ziph.write(file_path, os.path.relpath(file_path, path))

desktop_path = r'c:\Users\shivam rai\OneDrive\Desktop'
zip_path = os.path.join(desktop_path, 'Placement_Project.zip')

print(f"Creating zip file at {zip_path}...")
zipf = zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED)
zipdir(r'c:\Users\shivam rai\OneDrive\Desktop\ST2', zipf)
zipf.close()

print("Success! Created Placement_Project.zip on your Desktop.")
