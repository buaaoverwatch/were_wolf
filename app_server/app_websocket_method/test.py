from collections import Counter

list = ['a','b','c','a','d','b']
v = Counter(list)
print v
v = Counter(list).most_common(1)
print v
print v[0]
print v[0][0]
print v[0][1]