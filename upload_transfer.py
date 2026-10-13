import subprocess

def run():
    try:
        # Create a compressed file directly containing the git repo and all files
        subprocess.run("tar -czvf /tmp/StudyOS4.tar.gz -C /app .", shell=True, check=True)
        # Upload to free.keep.sh (free, no auth, short term hosting)
        result = subprocess.run("curl --upload-file /tmp/StudyOS4.tar.gz https://free.keep.sh/StudyOS4.tar.gz", shell=True, capture_output=True, text=True)
        print("UPLOAD RESULT:", result.stdout)
    except Exception as e:
        print("ERROR:", e)

if __name__ == "__main__":
    run()
