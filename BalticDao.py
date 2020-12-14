# Project data representation 2020
# Blueberry harvest data by employee

# Import all required libraries
import mysql.connector
from mysql.connector import cursor
import dbconfig as cfg


class BalticDao:
    db = ""

    def __init__(self):

        #Connect the MySQL Database
        self.db = mysql.connector.connect(host=cfg.mysql['host'],
                                          user=cfg.mysql['user'],
                                          password=cfg.mysql['password'],
                                          database=cfg.mysql['database'])
   
    def create(self, harvest):
        cursor = self.db.cursor()
        sql = "insert into harvest (id, employeeName, fieldSection, variety, quantity) values (%s,%s,%s,%s,%s)"
        values = [
            harvest['id'], harvest['employeeName'], harvest['fieldSection'], harvest['variety'], harvest['quantity']
        ]
        cursor.execute(sql, values)
        self.db.commit()
        cursor.close()
        return cursor.lastrowid

    def getAll(self):
        cursor = self.db.cursor()
        sql = 'select * from harvest'
        cursor.execute(sql)
        results = cursor.fetchall()
        returnArray = []
        for result in results:
            resultAsDict = self.convertToDict(result)
            returnArray.append(resultAsDict)

        cursor.close()
        return returnArray

    def findById(self, id):
        cursor = self.db.cursor()
        sql = 'select * from harvest where id = %s'
        values = [id]
        cursor.execute(sql, values)
        result = cursor.fetchone()
        cursor.close()
        return self.convertToDict(result)

    def update(self, harvest):
        cursor = self.db.cursor()
        sql = "update harvest set employeeName = %s, fieldSection = %s, variety = %s, quantity = %s where id = %s"
        values = [
            harvest['employeeName'], harvest['fieldSection'], harvest['variety'], harvest['quantity'],harvest['id']
        ]
        cursor.execute(sql, values)
        self.db.commit()
        cursor.close()
        return harvest

    def delete(self, id):
        cursor = self.db.cursor()
        sql = 'delete from harvest where id = %s'
        values = [id]
        cursor.execute(sql, values)
        self.db.commit()
        cursor.close()
        return {}

    def convertToDict(self, result):
        colnames = ['id', 'employeeName', 'fieldSection', 'variety', 'quantity']
        harvest = {}

        if result:
            for i, colName in enumerate(colnames):
                value = result[i]
                harvest[colName] = value
        return harvest

    def checkUser(self, username, password):
        cursor = self.db.cursor()
        sql = "select * from users where username = %s and password = %s"
        values = [username, password]
        cursor.execute(sql, values)
        # Fetch one record and return result
        result = cursor.fetchone()
        cursor.close()
        return self.convertToDict2(result)

    def convertToDict2(self, result):
        colnames = ["id", "username", "password"]
        #print(colnames)
        item = {}

        if result:
            for i, colName in enumerate(colnames):
                #print(colnames)
                value = result[i]
                item[colName] = value
        return item

balticDao = BalticDao()
