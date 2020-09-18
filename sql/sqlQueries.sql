-- DATABASE CREATION
create database if not exists IssueTrackerDb;

-- TABLE CREATION

create table if not exists issuetrackerdb.users(
userid int not null auto_increment,
firstname varchar(50) not null,
lastname varchar(50) not null, 
datejoined datetime not null,
email varchar(50) not null,
password varchar(100),
primary key(userid)
);

create table if not exists issuetrackerdb.companies(
companyid int not null auto_increment,
name varchar(50),
category varchar(50),
createdby int not null,
datecreated datetime not null,
primary key(companyid),
foreign key (createdby) references issuetrackerdb.users(userid)
);

create table if not exists issuetrackerdb.userandcompany(
userandcompanyid int not null auto_increment,
userid int not null,
companyid int not null,
primary key (userandcompanyid),
foreign key (userid) references issuetrackerdb.users(userid),
foreign key (companyid) references issuetrackerdb.companies(companyid)
);

create table if not exists issuetrackerdb.statuses(
statusid int not null auto_increment,
status varchar(20),
primary key(statusid)
);

create table if not exists issuetrackerdb.issues(
issueid int not null auto_increment,
title varchar(100) not null,
datecreated datetime not null,
createdby int not null,
content text not null,
status int not null,
primary key (issueid),
foreign key (createdby) references issuetrackerdb.userandcompany (userandcompanyid),
foreign key (status) references issuetrackerdb.statuses (statusid)
);

create table if not exists issuetrackerdb.comments(
commentid int not null auto_increment,
issueid int not null,
createdby int not null,
content text not null,
primary key (commentid),
foreign key (issueid) references issuetrackerdb.issues (issueid),
foreign key (createdby) references issuetrackerdb.users (userid)
);


-- INSERTIONS

insert into issuetrackerdb.statuses(status) values("active"), ("pending"), ("assigned"), ("closed");












