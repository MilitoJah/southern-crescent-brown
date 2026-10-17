import os,json,pathlib,urllib.request,urllib.error,uuid,base64,gzip
root=pathlib.Path(__file__).resolve().parent.parent
files={}
for path,mime in [('index.html','text/html; charset=utf-8'),('coming-soon.html','text/html; charset=utf-8'),('contact.html','text/html; charset=utf-8'),('more-meeting-photo-options.html','text/html; charset=utf-8'),('editorial-station-options.html','text/html; charset=utf-8'),('food-first-photo-options.html','text/html; charset=utf-8'),('meeting-photo-options.html','text/html; charset=utf-8'),('photo-directions.html','text/html; charset=utf-8'),('style.css','text/css; charset=utf-8'),('app.js','application/javascript; charset=utf-8'),('assets/table.svg','image/svg+xml')]:
 files['/'+path]={'body':(root/path).read_text(),'type':mime}
for slug in ['corporate-catering', 'meeting-catering', 'drop-off-catering', 'catering-menus', 'bar-and-beverage', 'hospitality-professionals', 'careers']:
 files['/'+slug+'.html']={'body':(root/(slug+'.html')).read_text(),'type':'text/html; charset=utf-8'}
for path in ['event-photo-options.html','core-services-concepts.html','concepts.html','concept-food-and-people.html','concept-food-and-people-meeting.html','concept-food-first.html','concept-business-in-action.html','concept-food-first-meeting.html','concept-business-in-action-meeting.html']:
 files['/'+path]={'body':(root/path).read_text(),'type':'text/html; charset=utf-8'}
for path in ['corporate-people-options.html','corporate-photo-p1.html','corporate-photo-p2.html','corporate-photo-p3.html','corporate-photo-p4.html']:
 files['/'+path]={'body':(root/path).read_text(),'type':'text/html; charset=utf-8'}
for filename,mime in [('catering-details.html','text/html; charset=utf-8'),('charcuterie-grazing.html','text/html; charset=utf-8'),('event-planning.html','text/html; charset=utf-8'),('404.html','text/html; charset=utf-8'),('finish.css','text/css; charset=utf-8'),('brand-fonts.css','text/css; charset=utf-8'),('robots.txt','text/plain; charset=utf-8'),('sitemap.xml','application/xml; charset=utf-8')]:
 files['/'+filename]={'body':(root/filename).read_text(),'type':mime}
for font in (root/'assets').glob('brand-font-*.ttf'):
 files['/assets/'+font.name]={'body':base64.b64encode(font.read_bytes()).decode(),'type':'font/ttf','base64':True}
for image in (root/'assets').glob('*.webp'):
 files['/assets/'+image.name]={'body':base64.b64encode(image.read_bytes()).decode(),'type':'image/webp','base64':True}
for logo in [(root/'assets'/'logo-primary.png'),(root/'assets'/'logo-stacked.png')]:
 files['/assets/'+logo.name]={'body':base64.b64encode(logo.read_bytes()).decode(),'type':'image/png','base64':True}
for logo in (root/'assets').glob('logo-*.svg'):
 files['/assets/'+logo.name]={'body':logo.read_text(),'type':'image/svg+xml'}
files['/microsoft-forms-setup.html']={'body':(root/'microsoft-forms-setup.html').read_text(),'type':'text/html; charset=utf-8'}
files['/assets/southern-crescent-inquiry-questions.docx']={'body':base64.b64encode((root/'assets'/'southern-crescent-inquiry-questions.docx').read_bytes()).decode(),'type':'application/vnd.openxmlformats-officedocument.wordprocessingml.document','base64':True}
manifest={}
chunks=[]
offset=0
for route,file in files.items():
 body=base64.b64decode(file['body']) if file.get('base64') else file['body'].encode('utf-8')
 manifest[route]={'offset':offset,'length':len(body),'type':file['type']}
 chunks.append(body)
 offset+=len(body)
archive=b''.join(chunks)
code=(root/'scripts'/'worker-template.js').read_text().replace('__ASSET_MANIFEST__',json.dumps(manifest,separators=(',',':')))

name='southern-crescent-brown'
base='https://api.cloudflare.com/client/v4/accounts/'+os.environ['CLOUDFLARE_ACCOUNT_ID']+'/workers/scripts/'+name
boundary='southern'+uuid.uuid4().hex
parts=[]
def part(name,body,content_type,filename=None):
 h='--'+boundary+'\r\nContent-Disposition: form-data; name="'+name+'"'+(' ; filename="'+filename+'"' if filename else '')+'\r\nContent-Type: '+content_type+'\r\n\r\n'
 parts.append(h.encode()+(body.encode() if isinstance(body,str) else body)+b'\r\n')
part('metadata',json.dumps({'main_module':'worker.js','compatibility_date':'2026-10-01'}),'application/json')
part('worker.js',code,'application/javascript+module','worker.js')
part('assets.bin',archive,'application/octet-stream','assets.bin')
payload=b''.join(parts)+('--'+boundary+'--\r\n').encode()
headers={'Authorization':'Bearer '+os.environ['CLOUDFLARE_API_TOKEN']}
def call(url,method,data,extra={}):
 req=urllib.request.Request(url,method=method,data=data,headers={**headers,**extra})
 try:
  with urllib.request.urlopen(req,timeout=60) as r:d=json.load(r)
 except urllib.error.HTTPError as e:
  raw=e.read().decode('utf-8',errors='replace')
  try:d=json.loads(raw)
  except json.JSONDecodeError:d={'errors':[{'message':raw[:300]}]}
  print(json.dumps({'http':e.code,'errors':d.get('errors'),'payload_bytes':len(data)}));raise SystemExit(1)
 print(json.dumps({'operation':method+' '+url.split('/workers/')[-1],'success':d.get('success'),'errors':d.get('errors')}))
 if not d.get('success'):raise SystemExit(1)
call(base,'PUT',payload,{'Content-Type':'multipart/form-data; boundary='+boundary})
call(base+'/subdomain','POST',json.dumps({'enabled':True,'previews_enabled':True}).encode(),{'Content-Type':'application/json'})
print('URL: https://southerncrescenthospitality.com')
