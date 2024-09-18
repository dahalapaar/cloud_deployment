from celery import Celery
import subprocess
import os
import json

app = Celery('tasks', broker='redis://localhost:6379/0')

@app.task
def trigger_terraform(data):
    # Set up Terraform files based on the submitted form data
    job_id = f"job-{data['projectName']}"
    job_dir = f"/tmp/{job_id}"
    os.makedirs(job_dir, exist_ok=True)

    # Create variables.tf based on form data
    with open(f"{job_dir}/variables.tf", "w") as f:
        for key, value in data.items():
            f.write(f'variable "{key}" {{\n  default = "{value}"\n}}\n')

    # Initialize Terraform in job_dir
    subprocess.run(["terraform", "init"], cwd=job_dir)
    subprocess.run(["terraform", "apply", "-auto-approve"], cwd=job_dir)

    return "Terraform job completed."
