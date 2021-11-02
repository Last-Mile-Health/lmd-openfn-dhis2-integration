/*
getMetadata(['organisationUnits'], {
    filters: [],
});
*/

/*
sample row
{   "county": "Grand Bassa", "county_id": 4, "health_district_id": 401,
    "health_district": "Campwood", "health_facility_id": "88Y2", 
    "health_facility": "Senyah Community Clinic",
    "cha_position_id": "88Y2-48", "chss_position_id": "88Y2-003"}
*/


alterState(state => {
    let COUNTRY_UID = "IV4g6A4iLgL";

    function addMetadata(row, countryUid, metadata) {
        if (metadata == null) metadata = [];
        metadata = addOrgUnit(row, "county_id", "county", "CY",
            null, countryUid, metadata);
        metadata = addOrgUnit(row, "health_district_id", "health_district", 
            "DI", "county_id", null, metadata);
        metadata = addOrgUnit(row, "health_facility_id", "health_facility", 
            "FA", "health_district_id", null, metadata);
        metadata = addOrgUnit(row, "chss_position_id", "chss_position_id", 
            "CS", "health_facility_id", null, metadata);
        metadata = addOrgUnit(row, "cha_position_id", "cha_position_id", 
            "CA", "chss_position_id", null, metadata);
        return metadata;
    }

    function addOrgUnit(row, orgUnitIdCol, orgUnitNameCol, orgUnitUidPrefix, 
        parentOrgUnitIdCol, countryUid, metadata) {
        let orgUnit;
        let updatedMetadata = [...metadata];
        let uid = generateUid(row[orgUnitIdCol].toString(), orgUnitUidPrefix);
        if (updatedMetadata.find(e => e.uid == uid) == undefined) {
            orgUnit = {
                name: row[orgUnitNameCol], 
                uid: uid, 
                code: row[orgUnitIdCol].toString(),
                parent: countryUid != null ? countryUid : 
                    metadata.find(f => 
                        f[parentOrgUnitIdCol] == row[parentOrgUnitIdCol]).uid
            };
            orgUnit[orgUnitIdCol] = row[orgUnitIdCol];
            updatedMetadata.push(orgUnit);
        }
        return updatedMetadata;
    }

    function generateUid(id, prefix) {
        let alphanumericSuffix = `${prefix}${id.replace(/\W/g, '')}`;
        return alphanumericSuffix.padStart(11, 'A');
    }

    function generateCSV(rows) {
        let keys = Object.keys(rows[0]).slice(0, 4); 
        let csv = keys.toString();
        rows.map(row => {
            csv = `${csv}\n"${row.name}","${row.uid}","${row.code}","${row.parent}"`;
        });
        return csv;
    }
    
    let metadata = [];
    state.response.body.map(row => {
        metadata = addMetadata(row, COUNTRY_UID, metadata);
    });
    //console.log(generateCSV(metadata));
    return {...state, metadataCSV: generateCSV(metadata)};
});


post(
    '/api/metadata?classKey=ORGANISATION_UNIT', 
    {
        body: state => {
            return state.metadataCSV;
        },
        headers: {
            'Content-Type': 'application/csv'
        }
    }
);
