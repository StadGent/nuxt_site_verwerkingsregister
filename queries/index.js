export const COUNT = `SELECT (count(?verwerking) as ?count)
FROM <http://stad.gent/data-processes/>
WHERE { ?verwerking a <http://data.vlaanderen.be/ns/toestemming#VerwerkingsActiviteit> }`

export const LIST = `PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX gdv: <http://stad.gent/data/ns/data-processing/>
SELECT
  ?id
  ?processor
  ?type
  ?name
  (concat(group_concat(distinct ?personalData;separator=','),group_concat(distinct ?sensitivePersonalData;separator=',')) as ?personalData)
  ?formal_framework
  (group_concat(distinct ?grantee;separator=',') as ?grantees)
FROM <http://stad.gent/data-processes/>
WHERE {
  ?verwerking a <http://data.vlaanderen.be/ns/toestemming#VerwerkingsActiviteit>;
  dcterms:identifier ?id;
  <http://data.vlaanderen.be/ns/toestemming#verwerkingsgrond>/skos:prefLabel ?formal_framework .
  ?verwerking <http://data.vlaanderen.be/ns/toestemming#verwerker>/skos:prefLabel ?processor;
  dcterms:type/skos:prefLabel ?type;
  dcterms:title ?name; 
  <http://stad.gent/data/ns/data-processing/grantee>/skos:prefLabel ?grantee .
  OPTIONAL { ?verwerking <http://stad.gent/data/ns/data-processing/hasPersonalData>/dcterms:type/skos:prefLabel ?personalData }
  OPTIONAL { ?verwerking <http://stad.gent/data/ns/data-processing/hasSensitivePersonalData>/dcterms:type/skos:prefLabel ?sensitivePersonalData }
}
group by
?verwerking
?id
?formal_framework
?processor
?type
?name`

/**
 * @return {string}
 */
export function DETAIL(id, URL) {
  return `PREFIX skos: <http://www.w3.org/2004/02/skos/core#> 
  PREFIX dcterms: <http://purl.org/dc/terms/> 
  PREFIX gdv: <http://stad.gent/data/ns/data-processing/> 
  SELECT  
  ?id  
  ?description 
  ?processor  
  ?type 
  ?name 
  ?personalDataDescription 
  ?sensitivePersonalDataDescription 
  (group_concat(distinct ?personalData;separator=',') as ?personalData) 
  (group_concat(distinct ?sensitivePersonalData;separator=',') as ?sensitivePersonalData) 
  ?formal_framework 
  ?formal_framework_clarification 
  (group_concat(distinct ?grantee;separator=',') as ?grantees) 
  ?storagePeriod 
  FROM <http://stad.gent/data-processes/> 
  WHERE { 
    ?verwerking a <http://data.vlaanderen.be/ns/toestemming#VerwerkingsActiviteit>; 
    dcterms:identifier ?id; 
    dcterms:description ?description; 
    <http://data.vlaanderen.be/ns/toestemming#verwerkingsgrond>/skos:prefLabel ?formal_framework; 
    gdv:formalFrameworkClarification ?formal_framework_clarification . 
    ?verwerking <http://data.vlaanderen.be/ns/toestemming#verwerker>/skos:prefLabel ?processor; 
    dcterms:type/skos:prefLabel ?type; 
    dcterms:title ?name;  
    <http://stad.gent/data/ns/data-processing/grantee>/skos:prefLabel ?grantee; 
    dcterms:temporal/dcterms:title ?storagePeriod 
    OPTIONAL { ?verwerking <http://stad.gent/data/ns/data-processing/hasPersonalData>/dcterms:type/skos:prefLabel ?personalData } 
    OPTIONAL { ?verwerking <http://stad.gent/data/ns/data-processing/hasSensitivePersonalData>/dcterms:type/skos:prefLabel ?sensitivePersonalData } 
    OPTIONAL { ?verwerking <http://stad.gent/data/ns/data-processing/hasPersonalData>/dcterms:description ?personalDataDescription } 
    OPTIONAL { ?verwerking <http://stad.gent/data/ns/data-processing/hasSensitivePersonalData>/dcterms:description ?sensitivePersonalDataDescription } 
    FILTER (?verwerking=<${URL}id/data-process/${id}>) 
  }`
}
