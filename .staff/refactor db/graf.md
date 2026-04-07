graph TD
    %% --- CAPA 0: EL NÚCLEO ARQUITECTÓNICO ---
    U1["Unidad 1: Identidad & To Be (A1)"] 
    
    %% --- CAPA 1: EL PRESENTE Y LA ACCIÓN ---
    U1 --> U2["Unidad 2: Presente Simple (A1)"]
    U1 --> U3["Unidad 3: Presente Continuo (A1-A2)"]
    
    %% --- CAPA 2: NARRACIÓN Y PROYECCIÓN ---
    U2 --> U4["Unidad 4: El Pasado Simple (A2)"]
    U2 --> U5["Unidad 5: Futuros Básicos (A2)"]
    U1 & U2 & U3 --> U6["Unidad 6: Pronombres & Modales (A2)"]
    
    %% --- CAPA 3: EL PUNTO DE INFLEXIÓN (PUENTE B1) ---
    %% El Presente Perfecto es el eje que une el Pasado con el Presente
    U4 & U2 --> U7["Unidad 7: Presente Perfecto (B1)"]
    
    %% Condicional 1 requiere Presente (U2) y Will (U5)
    U2 & U5 --> U8["Unidad 8: Estructuras Avanzadas (B1)"]
    
    %% --- CAPA 4: COMPLEJIDAD Y PERFECCIÓN (B2) ---
    %% Tiempos Perfectos Avanzados necesitan la lógica de continuidad (U3) y perfección (U7)
    U3 & U7 --> U9["Unidad 9: Tiempos Perfectos Adv (B1+)"]
    
    %% Condicionales 2 y 3 necesitan el Pasado (U4) y el Pasado Perfecto (U9)
    U4 & U9 --> U10["Unidad 10: Hipótesis & Deseos (B2)"]
    
    %% La Voz Pasiva y Reported Speech requieren DOMINIO TOTAL de todos los tiempos (U2, U4, U7, U9)
    U2 & U4 & U7 & U9 --> U11["Unidad 11: Transformaciones (B2)"]
    
    %% Gerundios e Infinitivos evolucionan de los Modales (U6) y estructuras de U8
    U6 & U8 --> U12["Unidad 12: Estilo & Cohesión (B2+)"]
    
    %% --- CAPA 5: MAESTRÍA Y MATICES (C1/C2) ---
    U11 & U12 --> U13["Unidad 13: Matices Complejos (C1)"]
    U13 --> U14["Unidad 14: Énfasis & Retórica (C1-C2)"]
    U14 --> U15["Unidad 15: Especialización (C2)"]

    %% --- DISEÑO DE NODOS ---
    %% Nodos Críticos (Bottlenecks)
    style U1 fill:#ffcdd2,stroke:#b71c1c,stroke-width:3px
    style U7 fill:#fff9c4,stroke:#fbc02d,stroke-width:2px
    style U11 fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
