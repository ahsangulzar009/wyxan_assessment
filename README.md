
<!-- Clone the github repo -->
git clone https://github.com/ahsangulzar009/wyxan_assessment.git

<!-- Then go the folders -->
cd wyxan_assessment && cd frontend && npm i
cd wyxan_assessment && cd backend && npm i


<!-- for database first Open Docker Desktop then run this command otherwise database will not work-->
docker run -d --name smallweb -p 27017:27017 -v mongodb_data:/data/db mongo:7

<!-- For seed run In wyxan_assessment/backend--> npm run seed
<!-- After that In wyxan_assessment/backend run--> npm run start:dev
<!-- After that In wyxan_assessment/frontend run--> npm run dev

--> Now Go To Browser and write in tab: http://localhost:3000


