export function COUNT (audience) {
  return `SELECT (count(?verwerking) as ?count)
FROM <http://stad.gent/data-processes/>
WHERE { ?verwerking a <http://data.vlaanderen.be/ns/toestemming#VerwerkingsActiviteit> .
  ?verwerking <http://schema.org/audience> ?audience 
  FILTER (?audience="${audience}"^^xsd:string)
}`
}

export function LIST (audience) {
  return `PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX gdv: <http://stad.gent/data/ns/data-processing/>
SELECT
  ?id
  ?processor
  ?type
  ?name
  (concat(group_concat(distinct ?personalData;separator=','),',',group_concat(distinct ?sensitivePersonalData;separator=',')) as ?personalData)
  ?formal_framework
  (group_concat(distinct ?grantee;separator=',') as ?grantees)
  ?audience
FROM <http://stad.gent/data-processes/>
WHERE {
  ?verwerking a <http://data.vlaanderen.be/ns/toestemming#VerwerkingsActiviteit>.
  ?verwerking <http://data.vlaanderen.be/ns/toestemming#verwerkingsgrond>/skos:prefLabel ?formal_framework.
  ?verwerking <http://data.vlaanderen.be/ns/toestemming#verwerker>/skos:prefLabel ?processor.
  ?verwerking dcterms:type/skos:prefLabel ?type.
  ?verwerking dcterms:identifier ?id.
  ?verwerking dcterms:title ?name. 
  ?verwerking  <http://schema.org/audience> ?audience
  OPTIONAL { ?verwerking  <http://stad.gent/data/ns/data-processing/grantee>/skos:prefLabel ?grantee }.
  OPTIONAL { ?verwerking <http://stad.gent/data/ns/data-processing/hasPersonalData>/dcterms:type/skos:prefLabel ?personalData }
  OPTIONAL { ?verwerking <http://stad.gent/data/ns/data-processing/hasSensitivePersonalData>/dcterms:type/skos:prefLabel ?sensitivePersonalData }
  FILTER (?audience="${audience}")
}
group by
?verwerking
?id
?formal_framework
?processor
?type
?name
?audience`
}

/**
 * @return {string}
 */
export function DETAIL (id) {
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
    dcterms:type/skos:prefLabel ?type; 
    dcterms:title ?name;  
    dcterms:temporal/dcterms:title ?storagePeriod;
    <http://data.vlaanderen.be/ns/toestemming#verwerkingsgrond>/skos:prefLabel ?formal_framework;
    <http://data.vlaanderen.be/ns/toestemming#verwerker>/skos:prefLabel ?processor.
    OPTIONAL { ?verwerking gdv:verduidelijkingRechtsgrond ?formal_framework_clarification }
    OPTIONAL { ?verwerking <http://stad.gent/data/ns/data-processing/grantee>/skos:prefLabel ?grantee }
    OPTIONAL { ?verwerking <http://stad.gent/data/ns/data-processing/hasPersonalData>/dcterms:type/skos:prefLabel ?personalData } 
    OPTIONAL { ?verwerking <http://stad.gent/data/ns/data-processing/hasSensitivePersonalData>/dcterms:type/skos:prefLabel ?sensitivePersonalData } 
    OPTIONAL { ?verwerking <http://stad.gent/data/ns/data-processing/hasPersonalData>/dcterms:description ?personalDataDescription } 
    OPTIONAL { ?verwerking <http://stad.gent/data/ns/data-processing/hasSensitivePersonalData>/dcterms:description ?sensitivePersonalDataDescription } 
    FILTER (STR(?id)='${id}')
  }`
}
