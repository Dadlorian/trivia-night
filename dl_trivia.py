import requests
import csv
import datetime
import io

# Configuration for sources
GITHUB_REPO = "https://raw.githubusercontent.com/QuartzWarrior/OTDB-Source/master/"
CATEGORIES =

# Recent 2026 data identified from blog archives and behavioral surveys
RECENT_2026_DATA =

def fetch_github_csvs():
    """Fetches high-volume CSVs updated as of early 2026."""
    all_questions =
    print("Fetching historical/high-volume data...")
    for cat in CATEGORIES:
        url = f"{GITHUB_REPO}{cat.replace(' ', '%20')}.csv"
        response = requests.get(url)
        if response.status_code == 200:
            # Commit metadata indicates these were updated approx Feb 2026
            reader = csv.DictReader(io.StringIO(response.text))
            for row in reader:
                all_questions.append({
                    "Question": row.get('question', row.get('Question')),
                    "Answer": row.get('correct_answer', row.get('Answer')),
                    "Category": cat,
                    "Source_Date": "2026-02-01", # Metadata date from Feb 2026 update
                    "Source_Name": "QuartzWarrior Repo"
                })
    return all_questions

def fetch_api_data(amount=50):
    """Fetches real-time questions from the Live API."""
    print("Fetching live API data...")
    url = f"https://opentdb.com/api.php?amount={amount}&type=multiple"
    response = requests.get(url).json()
    live_questions =
    if response['response_code'] == 0:
        for item in response['results']:
            live_questions.append({
                "Question": item['question'],
                "Answer": item['correct_answer'],
                "Category": item['category'],
                "Source_Date": datetime.date.today().strftime("%Y-%m-%d"),
                "Source_Name": "OpenTDB API"
            })
    return live_questions

def save_to_excel_ready_csv(data):
    """Saves the master list to a CSV file for Excel import."""
    keys =
    with open('master_trivia_2026.csv', 'w', newline='', encoding='utf-8') as output_file:
        dict_writer = csv.DictWriter(output_file, fieldnames=keys)
        dict_writer.writeheader()
        dict_writer.writerows(data)
    print(f"Success! {len(data)} questions saved to master_trivia_2026.csv")

if __name__ == "__main__":
    # 1. Get high volume data (approx 4,700 questions)
    master_list = fetch_github_csvs()
    
    # 2. Get live/fresh data
    master_list.extend(fetch_api_data(100))
    
    # 3. Add the curated 2026 behavioral questions
    for item in RECENT_2026_DATA:
        master_list.append({
            "Question": item["question"],
            "Answer": item["answer"],
            "Category": item["category"],
            "Source_Date": item["date"],
            "Source_Name": "933 Drive 2026 Archive"
        })
    
    save_to_excel_ready_csv(master_list)