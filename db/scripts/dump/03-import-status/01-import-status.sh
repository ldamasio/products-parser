
# Inside off db on Mongosh

db.offC.updateMany({"code":{$ne:null}}, {$set:{status:1}},{upsert:false})
