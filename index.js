const fs = require('fs')
const parser = require('fast-xml-parser')

const target_file = () => {
    if(process.argv.length == 3)
        return process.argv[2]
    return 'archetype-catalog.xml'
}

const doIt = () => {
    const plainXml = fs.readFileSync(target_file(), 'utf-8')
    const json = parser.parse(plainXml)

    json['archetype-catalog']['archetypes']['archetype'].forEach((element) => {
        const groupId = element.groupId
        const artifactId = element.artifactId
        const version = element.version
        console.log(`${groupId},${artifactId},${version}`)
    })
}

doIt()

