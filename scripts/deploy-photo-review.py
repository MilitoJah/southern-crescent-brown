"""Publish the isolated Feed photo-review site; never updates the business Worker."""
import json,mimetypes,os,pathlib,urllib.request,urllib.error,uuid
root=pathlib.Path(__file__).resolve().parent.parent/'photo-review'
files={};chunks=[];offset=0
for path in sorted(root.rglob('*')):
 if not path.is_file():continue
 route='/'+path.relative_to(root).as_posix();body=path.read_bytes()
 mime=mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
 if mime in ['text/html','text/css','application/javascript','text/javascript','application/json']:mime+='; charset=utf-8'
 files[route]={'offset':offset,'length':len(body),'type':mime};chunks.append(body);offset+=len(body)
archive=b''.join(chunks)
code='import archive from "./assets.bin";const files='+json.dumps(files,separators=(',',':'))+''';export default {async fetch(request){const p=new URL(request.url).pathname;if(p==='/robots.txt')return new Response('User-agent: *\\nDisallow: /\\n',{headers:{'Content-Type':'text/plain'}});const f=files[p==='/'?'/index.html':p];if(!f)return new Response('Not found',{status:404,headers:{'X-Robots-Tag':'noindex, nofollow'}});return new Response(request.method==='HEAD'?null:new Uint8Array(archive,f.offset,f.length),{headers:{'Content-Type':f.type,'X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex, nofollow','Cache-Control':'public, max-age=60'}})}};'''
name='southern-crescent-photo-review'
base='https://api.cloudflare.com/client/v4/accounts/'+os.environ['CLOUDFLARE_ACCOUNT_ID']+'/workers/scripts/'+name
boundary='review'+uuid.uuid4().hex;parts=[]
def part(name,body,type,filename=None):
 header='--'+boundary+'\r\nContent-Disposition: form-data; name="'+name+'"'+('; filename="'+filename+'"' if filename else '')+'\r\nContent-Type: '+type+'\r\n\r\n'
 parts.append(header.encode()+(body.encode() if isinstance(body,str) else body)+b'\r\n')
part('metadata',json.dumps({'main_module':'worker.js','compatibility_date':'2026-10-01'}),'application/json')
part('worker.js',code,'application/javascript+module','worker.js');part('assets.bin',archive,'application/octet-stream','assets.bin')
payload=b''.join(parts)+('--'+boundary+'--\r\n').encode()
def call(url,method,data,extra=None):
 req=urllib.request.Request(url,method=method,data=data,headers={'Authorization':'Bearer '+os.environ['CLOUDFLARE_API_TOKEN'],**(extra or {})})
 try:d=json.load(urllib.request.urlopen(req,timeout=60))
 except urllib.error.HTTPError as e:print('Cloudflare HTTP',e.code,e.read().decode()[:400]);raise SystemExit(1)
 if not d.get('success'):print('Cloudflare error',d.get('errors'));raise SystemExit(1)
 print(method,'successful')
call(base,'PUT',payload,{'Content-Type':'multipart/form-data; boundary='+boundary})
call(base+'/subdomain','POST',json.dumps({'enabled':True,'previews_enabled':True}).encode(),{'Content-Type':'application/json'})
print('Review: https://southern-crescent-photo-review.haja-jah.workers.dev/')
print('Review asset bytes:',len(archive))
