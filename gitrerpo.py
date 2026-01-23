''' doc '''
import requests
import base64

class GitHubRepoAgent:
    ''' make  '''
    def __init__(self, github_token, github_username):
        self.token = github_token
        self.username = github_username
        self.headers = {
            "Authorization": f"token {self.token}",
            "Accept": "application/vnd.github+json"
        }

    def create_repo(self, repo_name, description="", private=False):
        '''create'''
        url = "https://api.github.com/user/repos"
        payload = {
            "name": repo_name,
            "description": description,
            "private": private
        }

        response = requests.post(url, json=payload, headers=self.headers)
        response.raise_for_status()
        return response.json()

    def add_readme(self, repo_name, readme_text):
        '''add readme'''
        url = f"https://api.github.com/repos/{self.username}/{repo_name}/contents/README.md"
        
        content_encoded = base64.b64encode(readme_text.encode()).decode()

        payload = {
            "message": "Add README",
            "content": content_encoded
        }

        response = requests.put(url, json=payload, headers=self.headers)
        response.raise_for_status()
        return response.json()

    def create_repo_with_readme(self, repo_name, description, readme_text, private=False):
        '''create'''
        # 1. Create repo
        repo_info = self.create_repo(repo_name, description, private)
        repo_url = repo_info["html_url"]

        # 2. Add README
        self.add_readme(repo_name, readme_text)

        return f"Repository created successfully at: {repo_url}"


# -------------------------------
# Example Usage
# -------------------------------
if __name__ == "__main__":
    # GITHUB_TOKEN = "YOUR_GITHUB_PAT"
    GITHUB_TOKEN = "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"
    GITHUB_USERNAME = "gaaithri"

    agent = GitHubRepoAgent(GITHUB_TOKEN, GITHUB_USERNAME)

    message = agent.create_repo_with_readme(
        repo_name="propai-web",
        description="Marketing site for PropAI (AI-driven property matching assistant).",
        readme_text="# PropAI Web\n\nOfficial marketing + landing page for PropAI.",
        private=False
    )

    print(message)
