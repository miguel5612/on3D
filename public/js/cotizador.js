var userLanguage = window.navigator.userLanguage || window.navigator.language;
var container, camera, scene, renderer, controls, light, vol, mesh, height, heightFinal, width, widthFinal, depth, depthFinal;
var density = parseFloat("1.05");
//Costos
var pesoFilamento = 1 ; //kg de peso del valor de arriba
var filament_diameter = parseFloat("1.75"); // en cm
var printing_speed = parseFloat("600");
var hotEndSize = diametroBoquilla ; // en mm

document.addEventListener("DOMContentLoaded", function(event) { 
      // THE BROWSER LANGUAGE VARIABLE
      if (userLanguage.substring(0,2)=="es")
        {
        document.getElementById("btnSubmit").disabled = true;
        document.getElementById("densityLabel").innerHTML = "Densidad";
        document.getElementById("weightLabel").innerHTML = "Peso";
        document.getElementById("volumeLabel").innerHTML = "Volumen";
        document.getElementById("sizeLabel").innerHTML = "Medidas";
        document.getElementById("costKilogramLabel").innerHTML = "Costo de 1 kilogramo de filamento";
        document.getElementById("costFilaLabel").innerHTML = "Costo del filamento empleando en la impresi&oacute;n";
        document.getElementById("costTiempoLabel").innerHTML = "Costo del tiempo en que se realiza la impresi&oacute;n";
        document.getElementById("costMachLabel").innerHTML = "Costo de Mantenimiento";
        document.getElementById("costLocalLabel").innerHTML = "Costo del local";
        document.getElementById("costoSeguro").innerHTML = "Seguro en caso de fallos";
        document.getElementById("costGeneralLabel").innerHTML = "Costo de impresi&oacute;n";
        document.getElementById("diameterLabel").innerHTML = "Di&aacute;metro del filamento";
        document.getElementById("speedLabel").innerHTML = "Velocidad de impresi&oacute;n";
        document.getElementById("lengthLabel").innerHTML = "Longitud de filamento";
        document.getElementById("timeLabel").innerHTML = "Tiempo de impresi&oacute;n";
        document.getElementById("hoursLabel").innerHTML = "horas";
        document.getElementById("minutesLabel").innerHTML = "minutos";
        document.getElementById("about").innerHTML = "Hecho originalmente LRusso.com - Modificado por Miguel Califa";
        }
        else
        {
        document.getElementById("densityLabel").innerHTML = "Density";
        document.getElementById("weightLabel").innerHTML = "Weight";
        document.getElementById("volumeLabel").innerHTML = "Volume";
        document.getElementById("sizeLabel").innerHTML = "Size";
        document.getElementById("costKilogramLabel").innerHTML = "Filament cost per kilogram";
        document.getElementById("costLabel").innerHTML = "Printing cost";
        document.getElementById("diameterLabel").innerHTML = "Filament diameter";
        document.getElementById("speedLabel").innerHTML = "Printing speed";
        document.getElementById("lengthLabel").innerHTML = "Filament length";
        document.getElementById("timeLabel").innerHTML = "Build time";
        document.getElementById("hoursLabel").innerHTML = "hours";
        document.getElementById("minutesLabel").innerHTML = "minutes";
        document.getElementById("about").innerHTML = "Originally LRusso.com - Modified by miguel califa.";
        }


});


//Funciones

      function animate()
        {
        requestAnimationFrame(animate);
        light.position.copy(camera.getWorldPosition());
        renderer.render(scene,camera);
        }

      function onWindowResize()
        {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        }

      function moreDensity(a)
        {
        var result;
        if (a==true)
          {
          result = parseFloat(density) + parseFloat("0.05");
          if (result<=10000)
            {
            density = result;
            }
          }
          else
          {
          result = parseFloat(density) - parseFloat("0.05");
          if (result>0)
            {
            density = result;
            }
          }

        density = parseFloat(density).toFixed(2);

        var heightFinal = height / 10;heightFinal = heightFinal.toFixed(2);
        var widthFinal = width / 10;widthFinal = widthFinal.toFixed(2);
        var depthFinal = depth / 10;depthFinal = depthFinal.toFixed(2);
        var volumeFinal = vol / 1000;volumeFinal = volumeFinal.toFixed(2);
        var weightFinal = volumeFinal * density;weightFinal = weightFinal.toFixed(2);

        document.getElementById("densityValue").innerHTML = density;
        document.getElementById("weightValue").innerHTML = weightFinal;
        document.getElementById("volumeValue").innerHTML = volumeFinal;
        document.getElementById("widthValue").innerHTML = widthFinal; 
        document.getElementById("depthValue").innerHTML = depthFinal;
        document.getElementById("heightValue").innerHTML = heightFinal;
        updateCost();
        }

      function moreCost(a)
        {
        var result;
        if (a==true)
          {
          result = parseFloat(filament_cost) + parseFloat("5");
          if (result<=10000)
            {
            filament_cost = result;
            }
          }
          else
          {
          result = parseFloat(filament_cost) - parseFloat("5");
          if (result>0)
            {
            filament_cost = result;
            }
          }
        document.getElementById("costKilogramValue").innerHTML = filament_cost;

        updateCost();
        }

      function updateCost()
        {
        var volumeFinal = vol / 1000;volumeFinal = volumeFinal.toFixed(2);
        var weightFinal = volumeFinal * density;weightFinal = weightFinal.toFixed(2);
        var finalCost = weightFinal * filament_cost / 1000;
        finalCost = parseFloat(finalCost).toFixed(2);
        document.getElementById("costValue").innerHTML = finalCost;
        }

      function moreDiameter(a)
        {
        var result;
        if (a==true)
          {
          result = parseFloat(filament_diameter) + parseFloat("0.05");
          if (result<=10000)
            {
            filament_diameter = result;
            }
          }
          else
          {
          result = parseFloat(filament_diameter) - parseFloat("0.05");
          if (result>0)
            {
            filament_diameter = result;
            }
          }

        filament_diameter = parseFloat(filament_diameter).toFixed(2);

        var filament_length = parseFloat(( vol / ( filament_diameter / 2 ) ^ 2 / Math.PI ) * 2 / 10).toFixed(2);
        filament_length = parseFloat(filament_length).toFixed(0);

        var hours = Math.floor((filament_length / printing_speed) / 60);
        hours = parseFloat(hours).toFixed(0);

        var minutes = (filament_length / printing_speed) % 60;
        minutes = parseFloat(minutes).toFixed(0);

        if (minutes==0){minutes=1;}

        document.getElementById("diameterValue").innerHTML = filament_diameter;
        document.getElementById("lengthValue").innerHTML = filament_length;
        document.getElementById("hoursValue").innerHTML = hours;
        document.getElementById("minutesValue").innerHTML = minutes;
        }

      function moreSpeed(a)
        {
        var result;
        if (a==true)
          {
          result = parseFloat(printing_speed) + parseFloat("5");
          if (result<=10000)
            {
            printing_speed = result;
            }
          }
          else
          {
          result = parseFloat(printing_speed) - parseFloat("5");
          if (result>0)
            {
            printing_speed = result;
            }
          }

        printing_speed = parseFloat(printing_speed).toFixed(0);

        var filament_length = parseFloat(( vol / ( filament_diameter / 2 ) ^ 2 / Math.PI ) * 2 / 10).toFixed(2);

        var hours = Math.floor((filament_length / printing_speed) / 60);
        hours = parseFloat(hours).toFixed(0);

        var minutes = (filament_length / printing_speed) % 60;
        minutes = parseFloat(minutes).toFixed(0);

        document.getElementById("speedValue").innerHTML = printing_speed;
        document.getElementById("hoursValue").innerHTML = hours;
        document.getElementById("minutesValue").innerHTML = minutes;
        }

      function runViewer()
        {
        var fileInput = document.getElementById("modelOBJ");
        if (fileInput.files[0]!=null)
          {
          init(fileInput.files[0]);
          console.log(fileInput.files[0])
          //fileInput.value = null;
          }
        }

      window.onload = function()
        {
        document.getElementById("modelOBJ").disabled = false;
        document.getElementById("modelOBJ").value = null;
        }


      function init(file)
        {
        container = document.getElementById("container");
        container.innerHTML= "";

        camera = new THREE.PerspectiveCamera(37.8,window.innerWidth/window.innerHeight,1,100000);

        camera.position.z=300;
        camera.position.y=-500;
        camera.position.x=-500;
        camera.up=new THREE.Vector3(0,0,1);

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x303030);

        var filename = file.name;
        var extension = filename.split(".").pop().toLowerCase();
        var reader = new FileReader();
        console.log(filename);
        console.log(extension);
        document.getElementById("container2").style.display="none";

        if (extension=="stl")
          {
          reader.readAsArrayBuffer(file);
          }
        else if (extension=="3ds")
          {
          reader.readAsArrayBuffer(file);
          }
        else if (extension=="obj")
          {
          reader.readAsText(file);
          }
          else
          {
          document.getElementById("container2").style.display="none";
          if (userLanguage.substring(0,2)=="es")
            {
            alert("ERROR: Por favor verifique que el modelo se encuentre en formato STL, OBJ o 3DS.");
            }
            else
            {
            alert("ERROR: Please check that the model is a STL, OBJ or 3DS model.");
            }
          }

        reader.addEventListener("load", function (event)
          {
          try
            {
            var contents = event.target.result;
            if (extension=="obj")
              {
              var object = new THREE.OBJLoader().parse(contents);
              var sceneConverter = new THREE.Scene();
              sceneConverter.add(object);
              var exporter = new THREE.STLExporter();
              contents = exporter.parse(sceneConverter);
              }
            else if (extension=="3ds")
              {
              var object = new THREE.TDSLoader().parse(contents);
              var sceneConverter = new THREE.Scene();
              sceneConverter.add(object);
              var exporter = new THREE.STLExporter();
              contents = exporter.parse(sceneConverter);
              }

            var geometry = new THREE.STLLoader().parse(contents);
            geometry.computeFaceNormals();
            geometry.computeVertexNormals();
            geometry.center();

            var material = new THREE.MeshPhongMaterial({color:colorFondo});
            mesh = new THREE.Mesh(geometry, material);

            // CALCULATING THE VOLUME
            vol = 0;

            mesh.traverse(function (child)
              {
              if (child instanceof THREE.Mesh)
                {
                var positions = child.geometry.getAttribute("position").array;
                for(var i=0;i<positions.length; i+=9)
                  {
                  var t1 = {};
                  t1.x = positions[i+0];
                  t1.y = positions[i+1];
                  t1.z = positions[i+2];

                  var t2 = {};
                  t2.x = positions[i+3];
                  t2.y = positions[i+4];
                  t2.z = positions[i+5];

                  var t3 = {};
                  t3.x = positions[i+6];
                  t3.y = positions[i+7];
                  t3.z = positions[i+8];

                  vol += signedVolumeOfTriangle(t1,t2,t3);
                  }
                }
              });
            var box = new THREE.Box3().setFromObject(mesh);

            height = box.max.z - box.min.z;
            width = box.max.x - box.min.x;
            depth = box.max.y - box.min.y;

            heightFinal = height ;heightFinal = heightFinal.toFixed(2);
            widthFinal = width ;widthFinal = widthFinal.toFixed(2);
            depthFinal = depth ;depthFinal = depthFinal.toFixed(2);
            var volumeFinal = vol / 1000;volumeFinal = volumeFinal.toFixed(2);
            var weightFinal = volumeFinal * density;weightFinal = weightFinal.toFixed(2);


            //Largo del filamento sobre un cuadro sobre la pieza

            //El largo del filamento se calcula como (numero de capas)*(largo de un cuadrado)
            //Largo del cuadrado es dos veces el ancho y dos veces el largo
            var filament_length  = (depthFinal/hotEndSize)*((heightFinal*2)+(widthFinal*2)) ;
            var top =  (heightFinal/hotEndSize) * widthFinal;
            var bottom  = top;
            filament_length = filament_length + top + bottom;
            filament_length  = (filament_length *2).toFixed(2); //correccion en caso que sea compleja o necesite soportes
            //var filament_length = parseFloat(( vol / ( filament_diameter/20 ) ^ 2 / Math.PI ) * 2 / 10  ).toFixed(2);
            //filament_length = parseFloat(filament_length).toFixed(0);

            var hours = Math.floor((((filament_length/3)*1*10)/ (printing_speed/3)) / 60); //soportes
            hours = hours + Math.floor(((filament_length/3)*2*10 / (printing_speed/2)) / 60); // impresion normal
            hours = parseFloat(hours).toFixed(0);

            var minutes = (filament_length*5 / printing_speed) % 60;
            minutes = parseFloat(minutes).toFixed(0);

            if (minutes==0){minutes=1;}

            //var filaMeters = (pesoFilamento*1000)/(Math.PI * (((filament_diameter/2)/10)^2)*1.04);
            //console.log(filaMeters);
            //console.log(filament_cost/filaMeters);
            //console.log(filament_length/100);
            var filaCost = (filament_length/1000) * filament_cost ; // Costos por el filamento
            filaCost = parseFloat(filaCost).toFixed(2);

            var hourCost = diaLaboralCost/12; //12 horas de trabajo
            var minuteCost = hourCost/60; //identifica el costo del minuto

            var timeCost = (hours*hourCost) + (minutes*minuteCost);
            timeCost = timeCost.toFixed(2);

            //Costos derivados por mantenimiento de la maquina

            var maintenance = MantenimientoPorImpresion/200; //200 impresiones antes del reemplazo de todas sus partes
            maintenance = maintenance.toFixed(2);

            //Costos por el uso del local comercial (AQUI DEBEN INCLUIRSEN LOS SERVICIOS)
            var costoLocalHoras = costoLocalArriendo/(30*12); //30 dias, 12 horas
            var costoLocal = (costoLocalHoras * hours) + ((costoLocalHoras/60)*minutes); 
            costoLocal = costoLocal.toFixed(2);

            var costoTotal =  parseFloat(filaCost) + parseFloat(timeCost) + parseFloat(maintenance) + parseFloat(costoLocal) + parseFloat(costoInternoPorIntentos);
            costoTotal = costoTotal + (costoTotal*(porcentajeUtilidad/100)) ;

            var iva =  (costoTotal*(IVA/100));

            document.getElementById("container2").style.display="block";
            document.getElementById("costIVA").value = iva;
            document.getElementById("densityValue").value = density;
            document.getElementById("porIVA").value = IVA;
            document.getElementById("weightValue").value = weightFinal;
            document.getElementById("volumeValue").value = volumeFinal;
            document.getElementById("widthValue").value = widthFinal; 
            document.getElementById("depthValue").value = depthFinal;
            document.getElementById("heightValue").value = heightFinal;
            document.getElementById("costKilogramValue").value = filament_cost;
            document.getElementById("costValue1").value = filaCost;
            document.getElementById("costValue2").value = timeCost;
            document.getElementById("costValue3").value = maintenance;
            document.getElementById("costValue4").value = costoLocal;
            document.getElementById("costValue5").value = parseInt(costoTotal);
            document.getElementById("costValue6").value = costoInternoPorIntentos;
            document.getElementById("diameterValue").innerHTML = filament_diameter/10;
            document.getElementById("speedValue").innerHTML = printing_speed/10;
            document.getElementById("lengthValue").value = (filament_length/10).toFixed(2);
            document.getElementById("hoursValue").innerHTML = hours;
            document.getElementById("minutesValue").innerHTML = minutes;
            document.getElementById("timeValue").value = hours+'.'+minutes;
            document.getElementById("btnSubmit").disabled = false;

            var distance;

            if (height>width && height>depth)
              {
              distance = height * 2;
              }
            else if (width>height && width>depth)
              {
              distance = width * 2;
              }
            else if (depth>height && depth>width)
              {
              distance = depth * 2;
              }
            else
              {
              distance = depth * 4;
              }

            camera.position.set(0, -distance, 0);

            var x = distance + 200;
            var y = distance + 200;
            var division_x=Math.floor(x/10);
            var division_y=Math.floor(y/10);

            var wirePlane=new THREE.Mesh(new THREE.PlaneGeometry(x,y,division_x,division_y),new THREE.MeshPhongMaterial({emissive:0x707070,color:0x000000,wireframe:true,wireframeLinewidth:1}));
            wirePlane.receiveShadow=true;
            wirePlane.position.z = box.min.z - 0.1;
            scene.add(wirePlane);

            // AN ALTERNATIVE FOR MOVING THE OBJECT USING THE MOUSE WITHIN THE RENDERER
            // controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls = new THREE.OrbitControls(camera);
            controls.update();

            scene.add(mesh);
            }
            catch(err)
            {
            document.getElementById("container2").style.display="none";
            if (userLanguage.substring(0,2)=="es")
              {
              alert("ERROR: Por favor verifique que el modelo se encuentre en formato STL, OBJ o 3DS.");
              }
              else
              {
              alert("ERROR: Please check that the model is a STL, OBJ or 3DS model.");
              } 
            }
          }, false);

        light = new THREE.HemisphereLight(0xE8E8E8,0x000000,1);
        light.position.set(0,0,0);
        scene.add(light);

        renderer = new THREE.WebGLRenderer({antialias:true});
        renderer.setSize(window.innerWidth,window.innerHeight);
        container.appendChild(renderer.domElement);

        requestAnimationFrame(animate);

        window.addEventListener("resize", onWindowResize, false );
        }