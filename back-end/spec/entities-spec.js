/**
 * Created by rafik-naccache on 06/12/14.
 */


var entities = require('entities');


describe("Entites Test Suite", function() {
    var params = {name:"rafikentity",
            x:10,
            y:20,
        is_serverp : true,
        is_goodp : false,
        aptitudes :[],
        vulnerabilities:[],
        webmana:20,
        his_player_id:"rafikplayer"
    }

    var ent = new entities.Entity(params);

    it("With Serp true, is_client must be false", function() {
        expect(ent.is_client()).toBe(false);
    });


    it("moving, coords must be right", function(){
        ent.move(4,5);
        expect(ent.x).toBe(4);
    });


    it("if I buy discover at 10, I must find it and result is true", function(){
        var aptitude_ok = new entities.Aptitude({name:"discover",
            description:"blah blah",
            price:10});


        var result = ent.buyaptitudes(aptitude_ok);
        expect(result).toBe(true);
        expect(ent.aptitudes[0].name).toBe('discover');
    });


    it("if I buy discover once again, I must find result false",function() {

        var aptitude_ok = new entities.Aptitude({name:"discover",
            description:"blah blah 2",
            price:10});


        var result = ent.buyaptitudes(aptitude_ok);
        expect(result).toBe(false);
        expect(ent.aptitudes.length).toBe(1);
    })
    it("if I add vulnearbility I will find it",function() {

        var vuln_ok = new entities.Vulnerability({name:"vuln1",
            description:"blah blah 2",
            });

        var result = ent.add_vulnerability(vuln_ok);
        expect(result).toBe(true);
        expect(ent.vulnerabilities.length).toBe(1);
        expect(ent.vulnerabilities[0].name).toBe('vuln1');


    })

    it("if I add same vulnerability ",function() {

        var vuln_ok = new entities.Aptitude({name:"vuln1",
            description:"blah blah 2",
            price:10});

        var result = ent.add_vulnerability(vuln_ok);
        expect(result).toBe(false);
        expect(ent.vulnerabilities.length).toBe(1);


    })

    it("if I Incr Mana by 10, I ll find it 20 (20 - 10 + 10) ",function() {


        ent.incr_webmana(10)

        expect(ent.webmana).toBe(20);


    })

    it("if I subst Mana, I ll find it 10 (20 - 10) ",function() {


        ent.subst_webmana(10)




    })

});








