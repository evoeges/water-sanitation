var mapData;

var beneficiariesData;

var WASHbarChart;


// Use the Queue.js library to read two files

queue()
    .defer(d3.json, "data/africa.topo.json")
    .defer(d3.csv, "data/global-water-sanitation-2015.csv")
    .defer(d3.csv, "data/unicef-beneficiaries.csv")
    .await(function(error, mapTopJson, countryDataCSV, beneficiariesCSV){

        // --> PROCESS DATA
        mapData=topojson.feature(mapTopJson, mapTopJson.objects.collection).features;

        var countryData= countryDataCSV;
        beneficiariesData=beneficiariesCSV;


        beneficiariesData.forEach(function(d){
            d.year2014= +d.year2014;
            d.year2015=+d.year2015;
        });


//merge the datasets
        dataMerge();
        function dataMerge() {

            for (var i = 0; i < countryData.length; i++) {
                var csvCountry = countryData[i].Code;

                var sanitationValue = parseFloat(countryData[i].Improved_Sanitation_2015);
                var waterValue = parseFloat(countryData[i].Improved_Water_2015);
                var populationValue=countryData[i].UN_Population;

                for (var j = 0; j < mapData.length; j++) {
                    var jsonCountry = mapData[j].properties.adm0_a3_is;

                    if (csvCountry == jsonCountry) {

                        mapData[j].properties.sanitationValue = sanitationValue;
                        mapData[j].properties.waterValue = waterValue;
                        mapData[j].properties.populationValue= populationValue;
                        break;
                    }
                }
            }
        }

        // Update choropleth

        updateChoropleth();
        createBarChart();
    });


function createBarChart(){

    WASHbarChart= new BarChart("wash_chart_area", beneficiariesData);
}

function updateBarChart(){
    WASHbarChart.updateVis(beneficiariesData)
}



/* To Do:
Axis labels

 */
