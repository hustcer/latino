# A Dance Training Manage System Based on MongoDB and Node

## Summary：
This's a dance training manage system based on **NodeJS、Express Web Framework、Jade、MongoDB and MongoSkin, etc.**.This web application is built for dancers of Alibaba and the main goal is focused on dance course signing up management.
## Features
System consists of dancer forground and admin background. When started in production mode dancers can visit the basic forground pages without login. And when started in development mode the application will give you the admin's rights. Detailed as follows:
### Dancer Forground：
* **Online Course Signing Up:**<br/>
	- The sign up page will show you the realtime infomation of current courses, such as dance type, course capacity, total applied dancers, total approved dancers, and some other notice.<br/>
	- For New Dancers: You should fill the basic information, such as: job number, name, email, wangwang, etc.; Choosing the course you want to take; Then Submit; And the information will be stored into mongodb database.<br/>
	- For the Signed Dancers: Just fill your job number and system will fetch and fill the information you have submitted before; Then choose the course you want to take; And Submit. BTW: You can also update your information as well.<br/>
	- The applied courses will be audited by admin manually or by system automatically acoording to certain rules, such as whether man should be approved first or not, the capacity of course, total approved dancers and so on.<br/>
	- You can cancell the applied course before being auditted, and apply for quitness if it's approved.<br/>
	- Quiting of course should be audited too: Namely, could be refused or approved by admin in background.<br/>
* Dancers can view their personal information and the courses they have taken.
* Dancers could be searched or filtered according to their job number, department, gender, courses, course status or payment status.
* The filtered result will be paged, and could be sorted according to certain filed by forground user.
* Generate the mailing list of dancers which satisfy certain condition.<br/>
### Admin Background:
* **Course Life Cycle Management:**<br/>
	- Newly applied course status---------------------------(waiting)；<br/>
	- Dancer cancelled course status--------------------(cancelled)；<br/>
	- Admin refused course status---------------------------(refused)；<br/>
	- Admin approved course status----------------------(approved)；<br/>
	- Quit applied after approving-----------------------(quitApplied)；<br/>
	- Quit refused by admin---------------------------------(approved)；<br/>
	- Quit approved by admin--------------------------------------(quit)；<br/>
	
	Notice:*The life cycle status changing of courses should satisfy their pre-conditions, for example: Waiting courses can't change to Quit directly, but to cancelled is ok. And only the Waiting or QuitApplied courses could be changed to Approved, but approved ones can not change to waiting directly, only the quitApplied course could be changed to quit after refunding, and so on.*

* **Course Payment Status Manage**<br/>
	- Courses could be set to paid by admin if they are.
	- Quit applied courses could be refund and set to be unpaid(and then approve the quitness).
* **Dancer Information Management**<br/>
	- Dancer basic and advanced property(such as:level(<=9), vip grade(<=5), forever status、lock status and so on) could be modified by admin .<br/>

# Deploy Instruction：
1. Install NodeJs;
2. Install MongoDB and start the service;
3. Clone the repository: git clone ……latinode.git;
4. cd latinode & npm install -d & node app.js;
5. That's All! Visit http://localhost:3000 in your browser, You will have it!<br/><br/>
