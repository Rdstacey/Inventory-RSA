#!/usr/bin/env python3
"""
Push inventory JSON to GitHub repository via GitHub API.
Requires PyGithub library: pip install PyGithub
"""

import os
import sys
from pathlib import Path
from github import Github
from github.GithubException import GithubException

def push_to_github(
    token: str,
    repo_name: str,
    file_path: str,
    commit_message: str = "Update inventory data"
):
    """
    Push a file to GitHub repository.
    
    Args:
        token: GitHub personal access token
        repo_name: Repository name in format "username/repo" or "org/repo"
        file_path: Path to file to commit (relative to script directory)
        commit_message: Commit message
    """
    try:
        # Initialize GitHub client
        g = Github(token)
        
        # Get repository
        repo = g.get_repo(repo_name)
        
        # Read file content
        script_dir = Path(__file__).parent.parent
        full_file_path = script_dir / file_path
        
        if not full_file_path.exists():
            print(f"Error: File not found at {full_file_path}")
            return False
        
        with open(full_file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Get file in repository
        try:
            file = repo.get_contents(file_path)
            # Update existing file
            repo.update_file(
                file_path,
                commit_message,
                content,
                file.sha
            )
            print(f"Successfully updated {file_path} in repository")
        except GithubException as e:
            if e.status == 404:
                # File doesn't exist, create it
                repo.create_file(
                    file_path,
                    commit_message,
                    content
                )
                print(f"Successfully created {file_path} in repository")
            else:
                raise
        
        return True
        
    except GithubException as e:
        print(f"GitHub API error: {e}")
        return False
    except Exception as e:
        print(f"Error pushing to GitHub: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    # Get configuration from environment variables
    github_token = os.getenv('GITHUB_TOKEN')
    repo_name = os.getenv('GITHUB_REPO')  # Format: "username/repo"
    
    if not github_token:
        print("Error: GITHUB_TOKEN environment variable not set")
        print("Set it with: export GITHUB_TOKEN=your_token_here")
        sys.exit(1)
    
    if not repo_name:
        print("Error: GITHUB_REPO environment variable not set")
        print("Set it with: export GITHUB_REPO=username/repo-name")
        sys.exit(1)
    
    # Export inventory first
    print("Exporting inventory data...")
    from export_inventory import export_inventory
    if not export_inventory():
        print("Failed to export inventory. Aborting.")
        sys.exit(1)
    
    # Push to GitHub
    print(f"Pushing to GitHub repository: {repo_name}")
    success = push_to_github(
        github_token,
        repo_name,
        'data/inventory.json',
        'Update inventory catalog data'
    )
    
    sys.exit(0 if success else 1)

