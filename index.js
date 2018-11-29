'use strict'

const fs = require('fs')
const parser = require('fast-xml-parser')

const showHelp = () => {
    console.log(`node random-selector-maven/index.js <COMMAND> [CATALOG.XML]
COMMAND
    list          convert artifacts in catalog.xml to csv and print them.
    select        select an artifact from given catalog.xml and print it as json.
    help          print this message.
ARGUMENTS
    CATALOG.XML   "archetype-catalog.xml" file in the maven repository.
                  If this argument does not specified, find 
                  "archetype-catalog.xml" in the current directory.`)
}

const findCommand = () => {
    const MISSING_REQUIRED_VALUES = 2
    if(process.argv.length <= MISSING_REQUIRED_VALUES)
        return 'help'
    return process.argv[2]
}

const targetFile = () => {
    const SPECIFY_CATALOG_XMLL = 4
    if(process.argv.length === SPECIFY_CATALOG_XMLL)
        return process.argv[3]
    return 'archetype-catalog.xml'
}

const parseXml = (file) => {
    const plainXml = fs.readFileSync(file, 'utf-8')
    const json = parser.parse(plainXml)
    return json['archetype-catalog']['archetypes']['archetype']
}

const randomInt = (max) => Math.floor(Math.random() * max)

const toPath = (item) => item.replace(/\./g, '/')

const toUrl = (element) =>
    `http://central.maven.org/maven2/${toPath(element.groupId)}/${element.artifactId}/${element.version}/${element.artifactId}-${element.version}.jar`

const list = (archetypes) => {
    archetypes.forEach((element) => {
        console.log(`${element.groupId},${element.artifactId},${element.version},${toUrl(element)}`)
    })
}

const printSelected = (archetypes) => {
    const element = archetypes[randomInt(archetypes.length)]
    element.url = toUrl(element)
    console.log(element)
}

const doIt = () => {
    const command = findCommand()
    if(command === 'list')
        list(parseXml(targetFile()))
    else if(command === 'select')
        printSelected(parseXml(targetFile()))
    else
        showHelp()
}

doIt()

