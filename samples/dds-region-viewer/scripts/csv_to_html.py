import csv

table = ""
tr = ""

file_name = "countries-HTML.csv"

with open(file_name) as file:
    table += """<table id='cof-coverage'><thead><tr><th>Region Code</th><th>Country/Region</th><th>Country</th>
    <th>Admin Area 1</th><th>Admin Area 2</th><th>Postal code</th><th>Locality</th><th>School district</th></tr></thead><tbody class="list">\n"""

    csv_reader_object = csv.reader(file)
    next(csv_reader_object)

    for line in csv_reader_object:
        countryCode = line[0]
        countryName = line [1]
        country = line[2]
        admin1 = line[3]
        admin2 = line[4]
        admin3 = line[5]
        admin4 = line[6]
        postalCode = line[7]
        locality = line[8]
        sublocality1 = line[9]
        neighborhood = line[10]
        schoolDistrict = line[11]

        tr += "<tr>"
        tr += "<td class=\"region_code notranslate\">%s</td>\n" % countryCode
        tr += "<td class=\"region notranslate\">%s</td>\n" % countryName

        if "INCLUDE" in country:
            tr += "<td aria-label=\"Available\" class=\"available\">⬤</td>\n"
        else:
            tr += "<td aria-label=\"Unavailable\" class=\"unavailable\">---</td>\n"
        
        if "INCLUDE" in admin1:
            tr += "<td aria-label=\"Available\" class=\"available\">⬤</td>\n"
        else:
            tr += "<td aria-label=\"Unavailable\" class=\"unavailable\">---</td>\n"
        
        if "INCLUDE" in admin2:
            tr += "<td aria-label=\"Available\" class=\"available\">⬤</td>\n"
        else:
            tr += "<td aria-label=\"Unavailable\" class=\"unavailable\">---</td>\n"
        
        if "INCLUDE" in postalCode:
            tr += "<td aria-label=\"Available\" class=\"available\">⬤</td>\n"
        else:
            tr += "<td aria-label=\"Unavailable\" class=\"unavailable\">---</td>\n"
        
        if "INCLUDE" in locality:
            tr += "<td aria-label=\"Available\" class=\"available\">⬤</td>\n"
        else:
            tr += "<td aria-label=\"Unavailable\" class=\"unavailable\">---</td>\n"
        
        # if "INCLUDE" in sublocality1:
        #     tr += "<td aria-label=\"Available\" class=\"available\">⬤</td>\n"
        # else:
        #     tr += "<td aria-label=\"Unavailable\" class=\"unavailable\">---</td>\n"
        
        # if "INCLUDE" in neighborhood:
        #     tr += "<td aria-label=\"Available\" class=\"available\">⬤</td>\n"
        # else:
        #     tr += "<td aria-label=\"Unavailable\" class=\"unavailable\">---</td>\n"

        if "INCLUDE" in schoolDistrict:
            tr += "<td aria-label=\"Available\" class=\"available\">⬤</td>\n"
        else:
            tr += "<td aria-label=\"Unavailable\" class=\"unavailable\">---</td>\n"

        tr += "</tr>\n"

end = "</tbody></table>"
html = table + tr + end
files = open("countries.html", "w+")
files.write(html)
files.close()