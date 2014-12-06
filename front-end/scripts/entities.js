/**
 * Created by ibtissem on 06/12/14.
 */

var Entity = function(parameters){

    this.name = parameters.name;

    /**
     * Positions
     * @type {Number|*}
     */
    this.x = parameters.x;
    this.y = parameters.y;

    /**
     * Is server ?
     */
    this.is_serverp = parameters.is_serverp;
    this.is_server = function () {return is_serverp;};
    this.is_client = function () {return !is_server};

    /**
     * Is good ?
     */
    this.isgoodp = parameters.isgoodp;
    this.is_good = function() {
        return isgoodp;}
    this.is_bad = function(){
        return !isgoodp;}


    this.aptitudes = parameters.aptitudes;

    /*
     add vulnerability
     remove vulnearbility
     */
    this.vulnerabilities = parameters.vulnerabilities;
    this.webmana = parameters.webmana;
    this.his_player_id = parameters.his_player_id;
};



/*
 webmana
 */
Entity.prototype.incr_webmana = function(amount) { this.webmana+=amount;};
Entity.prototype.subst_webmana = function(amount) {this.webmana-=amount;};

/**
 * connexion declaration
 */
var Connection = function (parameters)
{
    this.name = parameters.name;
    this.source = parameters.source;
    this.target  = parameters.target;
};

/**
 * aptitude declaration
 */

var Aptitude = function(paramters)
{
    this.name = paramters;
    this.description = paramters.description;
    this.price =paramters.price;
};

/**
 * vulnerability declaration
 */

var Vulnerability = function(parameters){
    this.name = parameters.name;
    this.description = parameters.description;
    this.price = parameters.price;
};

/**
 * Attack Object
 */

var Attack = function(parameters) {
    this.name = parameters.name;
    this.source = parameters.source;
    this.target = parameters.target;
    this.source_aptitude =parameters.source_aptitude;
    this.target_vulnerability = parameters.target_vulnerability;

};

var Aptitude_w_Aptitude = function (apt1,apt2){
    this.aptitude1 = apt1, this.aptitude2 = apt2 };

var Aptitude_w_Vulnerability = function (vuln1,vuln2){
    this.vulnerability1 = vuln1;
    this.vulnerability2 = vuln2 ;}
