class AnalyticsManager:
    def statistics(self):
        return {'total_classified':1247,'recycling_rate':73,'this_month':342,'this_week':89,'distribution':{'Organic':28,'Plastic':32,'Paper':18,'Metal':12,'Glass':10},'weekly':[44,58,37,71,63,52,45],'risk':[{'bin':'Green Bin','days_left':'3 days','risk':'Low'},{'bin':'Blue Bin','days_left':'8 hrs','risk':'Medium'},{'bin':'Gray Bin','days_left':'Now','risk':'High'},{'bin':'Yellow Bin','days_left':'5 days','risk':'Low'},{'bin':'White Bin','days_left':'7 days','risk':'Low'}]}
class NotificationManager:
    def all(self):
        return [{'id':1,'title':'⚠️ Gray Bin Full','body':'Gray Bin in Gachibowli has reached 95% capacity. Immediate collection required.','time':'2m ago','unread':True},{'id':2,'title':'📊 Blue Bin Warning','body':'Blue Bin is at 88%. Predicted to overflow within 8 hours.','time':'1h ago','unread':True},{'id':3,'title':'✅ Waste Classified','body':'Your plastic waste has been classified successfully with 91.4% confidence.','time':'3h ago'}]
