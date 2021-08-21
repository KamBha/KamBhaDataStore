const fs=  require('fs');

const fileName = process.argv[2];
fs.readFile(fileName, 'utf-8', (err, dataFile) => {
    if (!dataFile)
        throw new Error(`Could not read file ${fileName}`);
    const data = JSON.parse(dataFile);
    const EXCLUDED_PROPERTIES = [
                'createdate', 
                'startdate', 
                'enddate', 
                'lastupdate', 
                'msoid', 
                'centroidid', 
                'shapeuuid', 
                'changetype',
                'processstate',
                'Shape__Length',
                'Shape__Area',
                'cadid',
                'createdate',
                'modifieddate',
                'wbcode',
                'abscode',
                'rid',
                'ltocode'
            ];
    
    const iterate = (object, parent, isCoordinatesGroup) => {
        let newObject = Array.isArray(object) ? [] : {};
        for (const key in object) {
            if (!object[key] || (parent === 'properties' && EXCLUDED_PROPERTIES.indexOf(key) !== -1))
                continue;
            if (isCoordinatesGroup) {
                newObject = [object[key][0].toFixed(5), object[key][1].toFixed(5)];
            }
            else if (Array.isArray(object[key])) {
                newObject[key] = object[key].map(
                        (item) =>  {
                            if (typeof (item) === 'number') {
                                return item.toFixed(5);
                            }
                            return iterate(item, key);
                        });
            }
            else if (typeof object[key] === 'object') {
                newObject[key] = iterate(object[key], key);
            }
            else {
                newObject[key] = object[key];
            }
        }
        return newObject;
    }
    console.log(JSON.stringify(iterate(data)));
});
