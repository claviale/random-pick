
//RANDOM PICK HERO ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    var button = document.getElementById('randomize');
    var result = document.getElementById('result');

    // Les choix possibles
    var options = ['Abaddon', 'Alchemist', 'Ancient Apparition', 'Anti-Mage', 'Arc Warden', 'Axe', 'Bane', 'Batrider', 'Beastmaster', 'Bloodseeker', 'Bounty Hunter', 'Brewmaster', 'Bristleback', 'Broodmother', 'Centaur Warrunner', 'Chaos Knight', 'Chen', 'Clinkz', 'Clockwerk', 'Crystal Maiden', 'Dark Seer', 'Dark Willow', 'Dawnbreaker', 'Dazzle', 'Death Prophet', 'Disruptor', 'Doom', 'Dragon Knight', 'Drow Ranger', 'Earth Spirit', 'Earthshaker', 'Elder Titan', 'Ember Spirit', 'Enchantress', 'Enigma', 'Faceless Void', 'Grimstroke', 'Gyrocopter', 'Hoodwink', 'Huskar', 'Invoker', 'Io',  'Jakiro', 'Juggernaut', 'Keeper of the Light', 'Kunkka', 'Legion Commander', 'Leshrac', 'Lich', 'Lifestealer', 'Lina', 'Lion', 'Lone Druid', 'Luna', 'Lycan', 'Magnus', 'Marci', 'Mars', 'Medusa', 'Meepo', 'Mirana', 'Monkey King', 'Morphling', 'Muerta', 'Naga Siren', 'Natures Prophet', 'Necrophos', 'Night Stalker', 'Nyx Assassin', 'Ogre Magi', 'Omniknight', 'Oracle', 'Outworld Destroyer', 'Pangolier', 'Phantom Assassin', 'Phantom Lancer', 'Phoenix', 'Primal Beast', 'Puck', 'Pudge', 'Pugna', 'Queen of Pain', 'Razor', 'Riki', 'Rubick', 'Sand King', 'Shadow Demon', 'Shadow Fiend', 'Shadow Shaman', 'Silencer', 'Skywrath Mage', 'Slardar', 'Slark', 'Snapfire', 'Sniper', 'Spectre', 'Spirit Breaker', 'Storm Spirit', 'Sven', 'Techies', 'Templar Assassin', 'Terrorblade', 'Tidehunter', 'Timbersaw', 'Tinker', 'Tiny', 'Treant Protector', 'Troll Warlord', 'Tusk', 'Underlord', 'Undying', 'Ursa', 'Vengeful Spirit', 'Venomancer', 'Viper', 'Visage', 'Void Spirit', 'Warlock', 'Weaver', 'Windranger', 'Winter Wyvern', 'Witch Doctor', 'Wraith King', 'Zeus'];

    button.addEventListener('click', function() {
        // Choisir aléatoirement parmi les options
        var randomIndex = Math.floor(Math.random() * options.length);
        var randomChoice = options[randomIndex];
        
        // Afficher le résultat dans le paragraphe #result
        result.textContent = randomChoice;
    });
});


//RANDOM PICK ROLE ---------------------------------------------------------------------------

var padding = {top:0, right:0, bottom:0, left:0},
            w = 500 - padding.left - padding.right,
            h = 500 - padding.top  - padding.bottom,
            r = Math.min(w, h)/2,
            rotation = 0,
            oldrotation = 0,
            picked = 100000,
            oldpick = [];
            color = d3.scale.linear()
                      .domain([0, 10])
                      .range(["#004D40", "#E0F2F1"]);


var data = [{"label":"Safe Lane", "value":1}, {"label":"Mid Lane", "value":2}, {"label":"Off Lane", "value":3}, {"label":"Support", "value":4}, {"label":"Hard Support", "value":5}, {"label":"Safe Lane", "value":6}, {"label":"Mid Lane", "value":7}, {"label":"Off Lane", "value":8}, {"label":"Support", "value":9}, {"label":"Hard Support", "value":10}];


var svg = d3.select('#chart')
    .append("svg")
    .data([data])
    .attr("viewBox", `0 0 ${w + padding.left + padding.right} ${h + padding.top + padding.bottom}`)
    .style("max-width", 500 +'px');

var container = svg.append("g")
    .attr("class", "chartholder")
    .attr("transform", "translate(" + (w/2 + padding.left) + "," + (h/2 + padding.top) + ")");

var vis = container
    .append("g");
            
var pie = d3.layout.pie().sort(null).value(function(d){return 1;});

// declare an arc generator function
var arc = d3.svg.arc().outerRadius(r);

// select paths, use arc generator to draw
var arcs = vis.selectAll("g.slice")
    .data(pie)
    .enter()
    .append("g")
    .attr("class", "slice");
    

arcs.append("path")
    .attr("fill", function(d, i){ return color(i); })
    .attr("d", function (d) { return arc(d); });

// add the text
arcs.append("text").attr("transform", function(d){
        d.innerRadius = 0;
        d.outerRadius = r;
        d.angle = (d.startAngle + d.endAngle)/2;
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius -10) +")";
    })
    .attr("text-anchor", "end")
    .text( function(d, i) {
        return data[i].label;
    });

container.on("click", spin);


function spin(d){
    
    container.on("click", null);

    //all slices have been seen, all done
    console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
    if(oldpick.length == data.length){
        console.log("done");
        container.on("click", null);
        return;
    }

    var  ps       = 360/data.length,
            pieslice = Math.round(1440/data.length),
            rng      = Math.floor((Math.random() * 1440) + 360);
        
    rotation = (Math.round(rng / ps) * ps);
    
    picked = Math.round(data.length - (rotation % 360)/ps);
    picked = picked >= data.length ? (picked % data.length) : picked;


    if(oldpick.indexOf(picked) !== -1){
        d3.select(this).call(spin);
        return;
    } else {
        oldpick.push(picked);
    }

    rotation += 90 - Math.round(ps/2);
    
    // On fait tourner la roue
    vis.transition()
        .duration(6000)
        .attrTween("transform", rotTween)
        // Actions à lancer à l'arrêt de la roue
        .each("end", function(){

            //mark question as seen
            /*d3.select(".slice:nth-child(" + (picked + 1) + ") path")
                .attr("fill", "purple");*/

            //populate question
            d3.select("#question p")
                .text("Rôle sélectionné : " + data[picked].label);

            oldrotation = rotation;
        
            container.on("click", spin);
        
            //alert("Rôle sélectionné : " + data[picked].label);
        });
}

//make arrow
svg.append("g")
    .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h/2)+padding.top) + ")")
    .append("path")
    .attr("d", "M-" + (r*.15) + ",0L0," + (r*.05) + "L0,-" + (r*.05) + "Z")
    .style({"fill":"red"});

//Cercle centre "Lancer"
container.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 70) // Rayon du cercle
    .style({"fill":"white","cursor":"pointer","background": "#CCEAF1"});

//Texte bouton "Lancer"
container.append("text")
    .attr("x", 0)
    .attr("y", 8)
    .attr("text-anchor", "middle")
    .text("GO")
    .style({"font-weight":"bold", "font-size":"22px"});
        
        
function rotTween(to) {
    var i = d3.interpolate(oldrotation % 360, rotation);
    return function(t) {
    return "rotate(" + i(t) + ")";
    };
}


function getRandomNumbers(){
    var array = new Uint16Array(1000);
    var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);

    if(window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function"){
        window.crypto.getRandomValues(array);
        console.log("works");
    } else {
        //no support for crypto, get crappy random numbers
        for(var i=0; i < 1000; i++){
            array[i] = Math.floor(Math.random() * 100000) + 1;
        }
    }

    return array;
}
