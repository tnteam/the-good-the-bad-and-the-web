/**
 * Created by rafik-naccache on 06/12/14.
 */
define(function () {
    return {
        /*
         * entity declaration
         */




        Entity : function(parameters){

            this.name = parameters.name;

            /*
            Move : set position
            */

            this.x = parameters.x;
            this.y = parameters.y;

            this.move = function(xp,yp) {
                this.x= this.xp;
                this.y = this.yp;};

            this.is_serverp = parameters.is_serverp;
            this.is_server = function () {return is_serverp;};
            this.is_client = function () {return !is_server};

            this.isgoodp = parameters.isgoodp;
            this.is_good = function() {return isgoodp;}
            this.is_bad = function()   {return !isgoodp;}
            /*
            buy aptitude
             */
            this.buyaptitudes = function(bought_aptitude) {
                if (this.webmana>bought_aptitude.price) {
                    //TODO verif bought not exists
                    this.aptitudes.push(bought_aptitude);
                    return true;
                } else return false;
            }
            this.aptitudes = parameters.aptitudes;

            /*
            add vulnerability
            remove vulnearbility
             */
            this.vulnerabilities = parameters.vulnerabilities;

            this.addvulnerability = function(added_vuln) {
                //TODO verif added not exists
                this.vulnerabilities.push(added_vuln);
                return true;
            }

            /*
            webmana
             */
            this.incr_webmana = function(amount) { this.webmana+=amount;};
            this.subst_webmana = function(amount) {this.webmana-=amount;};
            this.webmana = parameters.webmana;
            this.his_player_id = parameters.his_player_id;
        },

        /**
         * connexion declaration
         */
        Connection : function (parameters)
        {
            this.name = parameters.name;
            this.source = parameters.source;
            this.target  = parameters.target;
        },

        /**
         * aptitude declaration
         */

        Aptitude : function(paramters)
        {
            this.name =paramters;
            this.description = paramters.description;
            this.price =paramters.price;
        },

        /**
         * vulnerability declaration
         */

        Vulnerability : function(parameters){
            this.name = parameters.name;
            this.description = parameters.description;
            this.price = parameters.price;
        },

        /**
         * Attack Object
         */

        Attack : function(parameters) {
            this.name = parameters.name;
            this.source = parameters.source;
            this.target = parameters.target;
            this.source_aptitude =parameters.source_aptitude;
            this.target_vulnerability = parameters.target_vulnerability;

        },

        Aptitude_w_Aptitude : function (apt1,apt2)
        { this.aptitude1 = apt1, this.aptitude2 = apt2 },
        Aptitude_w_Vulnerability : function (vuln1,vuln2)
        { this.vulnerability1 = vuln1, this.vulnerability2 = vuln2 },

    };
});