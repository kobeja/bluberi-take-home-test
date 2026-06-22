# Summary
A small 3x3 slot app that only pays if the middle row matches.

# How to run the project locally
Note: This project requires Node.js to run locally. If you don't have node you can install it from https://nodejs.org

- clone this repository or download it as a ZIP file
- open a new terminal at the project root
    - If you downloaded the repo as a ZIP, the project root will be `../bluberi-take-home-test-main/bluberi-take-home-test-main`
    - Most operating systems will allow you to right-click within the folder and open a terminal
    - If not, you can run this command `cd {your drive}\{your directory}\bluberi-take-home-assignment` to open the project root
        - Example: `cd D:\downloads\bluberi-take-home-test-main`

- once inside the project, run the command `npm install` to install the projects dependencies
- run the command `npm run dev` to build and host the project
- open a browser at `http://localhost:5173/`

- when finished with the app, return to your terminal and click `CTRL + C` to close the local web server

# Key architecture decisions
- Separation of concerns (UI logic, busniess logic, data sourcing)
- Data driven design
    - I define a slot schema as json to simulate what would be expected in a full stack production environment.
    - Data driven design is important, as we want our apps to be server authoritative. The client should never own critical data.
    - It also allows our apps to be dynamic. Taking this project as an example, with proper client-side interpretation and deeper defined 
    slot configurations, we could use this client to run _any_ slot.
    - In production, the presentation layer would be adaptive to this configuration, but for this project the HTML expects a 3x3 slot.
- Interface driven communication
    - Coming from a C# background, interfaces are heavily used to not only define behavior, but to protect consumers and guard access.
    - Instead of having objects depend directly on concrete implementations, they communicate through interfaces.
    - This design drives intentional programming, if a developer wants to expose behavior, they must define it in the interface.
    - This abstraction layer reduces coupling and makes the app easier to test, modify, or extend.
- Composition
    - For this project there is no real choice to be made between composition or inheritance, but in general I favor composition.
    - I favor composition for similar reasons that I favor interfaces. Composition reduces coupling, makes dependencies explicit, and 
    allows for behavior to be swapped or tested easily.

In general, I prefer writing explicit code. I want readers (including futrue me) to be able to understand clearly what is expected, and delivered 
when reading the code. Reading and understanding code is one of the most important aspects of being a software developer, and this drives me to code the 
way that I do.

# How you used AI tools for this project, and how they influenced your implementation decisions
As per the instructions in the email, I did not use AI for this project.

# What you would improve with more time?
- Proper validation and mapping for DTOs.
- Thorough error handling.
    - I glossed over a lot of error handling as I'm using local configurations and it's a small app. In production I like to write defensive code.
- I'd move critical components (spin logic, pay logic) to the server, as these should never be on the client-side.
    - With a proper server side API, the communication would look like [server API] <---> [client service (SlotService)] <---> [client components].
    Client components only interact with the client service, and the client service only interacts with the server. I'd love to discuss this topic 
    further over a voice call, as I can explain the role of a client service in more detail.
- Small point but with async development I like to use task schedulers and timeout tokens. This layer of security is crucial when working in a production 
environment.
- Implement core slot features (credits, adjustable bet value, jackpot), and some additional features like (free spins, bonus feature, info/help menu, etc...)
- I'd love to continue to extend this project towards being a multi-slot app. I'd implement an orchestrator that essentially does what main.ts is doing. It 
would also own a map of slot names to their slot models. It'd expose a `bootstrapSlot(slotName: string)` function that would compose the required 
components and launch the slot. Of course, I'd also have to extend the UI to be more adaptable as mentioned above.
- Finally, I would document the code itself. When working in teams it is important to document public facing functions and important systems. These summaries 
give a quick way to understand functionality without having to read every line of the interface or function. A quick summary comment allows this, and is a 
standard practice in the large teams I've worked with.