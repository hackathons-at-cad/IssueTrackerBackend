-- DATABASE CREATION
create database if not exists heroku_213f9eefb18f399;

-- TABLE CREATION

create table if not exists heroku_213f9eefb18f399.users(
userid int not null auto_increment,
firstname varchar(50) not null,
lastname varchar(50) not null, 
datejoined datetime not null,
email varchar(50) not null,
password varchar(100),
primary key(userid),
unique key (email)
);

create table if not exists heroku_213f9eefb18f399.companies(
companyid int not null auto_increment,
name varchar(50),
category varchar(50),
createdby int not null,
datecreated datetime not null,
primary key(companyid),
foreign key (createdby) references heroku_213f9eefb18f399.users(userid),
unique key (name, category)
);

create table if not exists heroku_213f9eefb18f399.userandcompany(
userandcompanyid int not null auto_increment,
userid int not null,
companyid int not null,
primary key (userandcompanyid),
foreign key (userid) references heroku_213f9eefb18f399.users(userid),
foreign key (companyid) references heroku_213f9eefb18f399.companies(companyid)
);

create table if not exists heroku_213f9eefb18f399.statuses(
statusid int not null auto_increment,
status varchar(20),
primary key(statusid)
);

create table if not exists heroku_213f9eefb18f399.issues(
issueid int not null auto_increment,
title varchar(100) not null,
datecreated datetime not null,
companyid int not null,
content text not null,
status int not null,
primary key (issueid),
foreign key (companyid) references heroku_213f9eefb18f399.companies (companyid),
foreign key (status) references heroku_213f9eefb18f399.statuses (statusid),
unique key (title, content)
);

create table if not exists heroku_213f9eefb18f399.comments(
commentid int not null auto_increment,
issueid int not null,
createdby int not null,
content text not null,
primary key (commentid),
foreign key (issueid) references heroku_213f9eefb18f399.issues (issueid),
foreign key (createdby) references heroku_213f9eefb18f399.users (userid)
);


-- INSERTIONS

insert into heroku_213f9eefb18f399.statuses(status) values("active"), ("pending"), ("assigned"), ("closed");












