query({
    sql: state => {
      return `select county, county_id, health_district_id, health_district, 
        health_facility_id, health_facility, position_id as cha_position_id, 
        chss_position_id from view_base_position_cha where county = 'Grand Bassa'
        or (county = 'Grand Gedeh' and health_district in ('Konobo', 'Gbao'))`;
    }
});
