import csv
import os
import json

# --- Configuration ---
script_dir = os.path.dirname(os.path.abspath(__file__))
file_name = os.path.join(script_dir, "countries-JSON.csv")
output_file = os.path.join(script_dir, "../src/countries.json")

# 1. Initialize an empty list to hold all the country dictionaries
json_data = []

# --- Data Processing ---

# Use 'r' mode for reading
try:
    with open(file_name, mode='r', encoding='utf-8') as file:
        # Use csv.DictReader to read rows as dictionaries, using the header row as keys.
        csv_reader_object = csv.reader(file)
        
        # Skip the header row
        next(csv_reader_object)

        # Iterate through each row in the CSV
        for line in csv_reader_object:
            countryCode = line[0]
            countryName = line [1]
            country = line[2]
            admin1 = line[3]
            admin2 = line[4]
            # admin3 = line[5] # Not used in output structure
            # admin4 = line[6] # Not used in output structure
            postalCode = line[7]
            locality = line[8]
            # sublocality1 = line[9] # Not used in output structure
            # neighborhood = line[10] # Not used in output structure
            schoolDistrict = line[11]

            # 2. Build the Python dictionary object for the current entry
            entry_dict = {
                "name": countryName,
                "code": countryCode,
                "feature": {
                    # Boolean logic is cleaner when checking membership/value
                    "country": "INCLUDE" in country,
                    "administrative_area_level_1": "INCLUDE" in admin1,
                    "administrative_area_level_2": "INCLUDE" in admin2,
                    "postal_code": "INCLUDE" in postalCode,
                    "locality": "INCLUDE" in locality,
                    "school_district": "INCLUDE" in schoolDistrict
                }
            }
            
            # 3. Add the complete dictionary to the main list
            json_data.append(entry_dict)

except FileNotFoundError:
    print(f"Error: CSV file not found at {file_name}")
    exit()

# --- Output File Writing ---

# 4. Use json.dump() to write the entire list to the file
# 'w' mode for writing (will overwrite file if it exists)
try:
    with open(output_file, 'w', encoding='utf-8') as write_file:
        # json.dump() handles serialization, indentation, and ALL commas correctly!
        json.dump(json_data, write_file, indent=4)
        
    print(f"Successfully created JSON file at {output_file}")

except Exception as e:
    print(f"An error occurred during JSON writing: {e}")