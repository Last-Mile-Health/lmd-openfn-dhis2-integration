function reorganizeData(data, keys) {
    let newData = [];
    let keyName, keyVal;
    if (keys.length > 0) {
        for (var i = 0; i < data.length; i++) {
            keyName = keys[0];
            keyVal = data[i][keyName];
            if (newData.findIndex(e => e[keyName] == keyVal) == -1) {
                let filteredData = data.filter(e => e[keyName] == keyVal);
                if (keys.length == 1) {
                    // [keyName] is a computed property name
                    newData.push({ [keyName]: keyVal, data: filteredData });
                }
                else {
                    // recursively rearrange hierarchy if there are more keys
                    newData.push({
                        [keyName]: keyVal,
                        data: reorganizeData(filteredData, keys.slice(1))
                    });
                }
            }
        }
    }

    return newData;
}

let data = [
    {
        "period": "202109",
        "orgUnit": "CHA1",
        "dataElement": "O2q3dVLwZhY",
        "value": "1234",
    },
    {
        "period": "202110",
        "orgUnit": "CHA1",
        "dataElement": "O2q3dVLwZhY",
        "value": "1235",
    },
    {
        "period": "202110",
        "orgUnit": "CHA2",
        "dataElement": "O2q3dVLwZhY",
        "value": "1236",
    },
    {
        "period": "202109",
        "orgUnit": "CHA2",
        "dataElement": "O2q3dVLwZhY",
        "value": "1237",
    },
]

redata = reorganizeData(data, ['orgUnit', 'period']);

// the above returns:
redata =
    [
        {
            orgUnit: 'CHA1',
            data: [
                {
                    period: '202109',
                    data: [
                        {
                            period: '202109',
                            orgUnit: 'CHA1',
                            dataElement: 'O2q3dVLwZhY',
                            value: '1234'
                        }
                    ]
                },
                {
                    period: '202110',
                    data: [
                        {
                            period: '202110',
                            orgUnit: 'CHA1',
                            dataElement: 'O2q3dVLwZhY',
                            value: '1235'
                        }
                    ]
                }
            ]
        },
        {
            orgUnit: 'CHA2',
            data: [
                {
                    period: '202110', data: [
                        {
                            period: '202119',
                            orgUnit: 'CHA2',
                            dataElement: 'O2q3dVLwZhY',
                            value: '1236'
                        }
                    ]
                },
                {
                    period: '202109', data: [
                        {
                            period: '202109',
                            orgUnit: 'CHA2',
                            dataElement: 'O2q3dVLwZhY',
                            value: '1237'
                        }
                    ]
                }
            ]
        }
    ];
