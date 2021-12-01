/*
    Populates state.data and state.organisationUnits
*/

getMetadata(['organisationUnits'], {});

fn(state => {
    return {...state, organisationUnits: state.data.organisationUnits};
})

/* Fetch monthly service report data. This makes a GET request of the form: 
    http://<dhis2-server>/api/dataValueSets.json?
        orgUnitGroup=iQHIwRQ8Dqf
        &period=202111,202110,202109
        &dataSet=IBhezUyCB5Q&includeDeleted=true

    and stores the value in state.data for use by downstream jobs
*/
getDataValues({
    orgUnitGroup: 'iQHIwRQ8Dqf', // CHA
    period: (state) => {
        /* get data for the last eight months */
        let NUM_PERIODS = 8;
        /*
        * e.g. getMostRecentPeriods(2) returns [ '202107', '202106' ]
        * if the current date is in July 2021
        */
        function getMostRecentPeriods(numPeriods) {
            let periods = [];
            let dateISO;
            let date = new Date();
            for (var i = 0; i < numPeriods; i++) {
                dateISO = date.toISOString();
                periods.push(`${dateISO.substr(0, 4)}${dateISO.substr(5, 2)}`)
                if (i < numPeriods - 1) {
                    date.setMonth(date.getMonth() - 1);
                }
            }
            return periods;
        }
        return getMostRecentPeriods(NUM_PERIODS).toString();
    },
    dataSet: 'IBhezUyCB5Q', // CHA Monthly Service Report
    includeDeleted: true
});

/* remove bloat */
fn(state => {
  delete state.references;
  return state;
})