# Bad Render Engine
###### version 1.3

I think most of the code works in a very awkward way.
The mesh rotation is a nightmare, works in a very weird way, and is a complete mess. I tried to improve it, but the only way to do that is redoing it from 0.

The engine features some render modes, base color render mode, wireframe render mode, solid color render mode, light preview render mode, depth preview render mode, and a complete render mode wich combines the base color and the light.

This shit runs extremely well in bad computers

oh, by the way, this only draws triangles, so something like reflections are really dificult, and light values are based on distance, shadows are not posible

![image](https://user-images.githubusercontent.com/59940124/190127666-5db3ebd0-0cca-4fa6-8c79-0f6e12c30aaa.png)

*complete render "shader"*  
![image](https://user-images.githubusercontent.com/59940124/151160246-eb9c2244-8832-4871-8ad3-4b4b99c7ce77.png)

*light render "light"*  
![image](https://user-images.githubusercontent.com/59940124/151161752-7e721ab5-a13c-46f3-914f-2808c2ed2842.png)

*depth render "depth"*  
![image](https://user-images.githubusercontent.com/59940124/151161777-1911cb0f-455c-4208-95cf-37613171319d.png)

*base color render "face"*  
![image](https://user-images.githubusercontent.com/59940124/151161793-4096477f-0adb-4df0-9fc3-b6193187873f.png)

*solid color render "mesh"*  
![image](https://user-images.githubusercontent.com/59940124/151161813-be99d492-bf76-4ae9-aaf1-1cd682411a12.png)

*shadered wireframe render "shadered wireframe"*  
![image](https://user-images.githubusercontent.com/59940124/190118769-d549ec49-cbc1-4c44-b68f-7537bc5ef09e.png)

*complex wireframe render "complex wireframe"*  
![image](https://user-images.githubusercontent.com/59940124/190118631-bebfabb6-f1f3-43a0-aa5e-d42addc9d57d.png)

*wireframe render "wireframe"*  
![image](https://user-images.githubusercontent.com/59940124/151161839-b528f35e-8f32-43dc-91c8-e136f690a72a.png)

***
If you want to modify the background just replace the image called "Background.jpg", and the same goes for the light icon.

***
*do whatever you want with the code, but please give credits if you publish it*

***
**Changes from last version:**
```diff
+added mesh json data editing, exporting and importing
+added mesh name display
+added complex wireframe rendering
+added shaded wireframe rendering
-fixed speed displayed values, now clampled to 2 decimals
-changed "frames per second" text to "calls per second"
-changed "render scale" text to "world scale"
-changed debug font
-changed how options are ordered and separated
!the java script code has been separated from the html code
+added missing shading info from the options
-fixed target fps not updating when force fps target was disable
```
