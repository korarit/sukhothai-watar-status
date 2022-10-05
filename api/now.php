<?php
date_default_timezone_set("Asia/Bangkok");

$date_now = date("Y-m-d");
$hour_now = date("G");
$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => "https://data.tmd.go.th/nwpapi/v1/forecast/location/hourly/at?lat=".$_GET['lat']."&lon=".$_GET['lon']."&fields=rain,cloudlow,cond,tc&date=$date_now&hour=$hour_now&duration=1",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "GET",
  CURLOPT_HTTPHEADER => array(
    "accept: application/json",
    "authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImE4Y2QwZGI4Y2VmYWEzMzI0ODY5ZThjYWMxYjFhZmJkYzgwZmYyNWQzMjczOGMyZDQwMWFhMDgwN2JmMzcwNDJlMzY4Mzk4YWI4Mjg2YTRjIn0.eyJhdWQiOiIyIiwianRpIjoiYThjZDBkYjhjZWZhYTMzMjQ4NjllOGNhYzFiMWFmYmRjODBmZjI1ZDMyNzM4YzJkNDAxYWEwODA3YmYzNzA0MmUzNjgzOThhYjgyODZhNGMiLCJpYXQiOjE2NjQ4Njk5NjksIm5iZiI6MTY2NDg2OTk2OSwiZXhwIjoxNjk2NDA1OTY5LCJzdWIiOiIxNTc1Iiwic2NvcGVzIjpbXX0.OpTZBSmFKDdmX9liJIy5_qtQ1tWWWB6tgrG-5r8-n1B-rM1HvbtVfIWrNvHMh6Ek9GstMpeemafLlECeVWwep6BGeQE5luEzEZvuHOwjWHLg3yk01t1D3_jFj7dHLnoeJ7IzHKG-pDRWxeu4h9UnkpW1nZB6LI51w2K63rJ-FRjBQt5zXINWFek_Gu-DPfGx-1HjnwDhEOfysrDg-sTIb15BnUoIFR-XfIzTdAP8SFXHSr2zJQEtmSxlci8FX6lhg5UMcw5WQ85yrGcjR2126B_q0xivOt5UqKeBHPnrPYsz2Y5tGu0cHcVuaKDqmrgFOAt0pG43GlhnGSEtfwDTv0sJBpCpp7SAdSXs1lhygrihVjnbbhbZdxPK871nsum4r6p44nkC9Rz4MugQZYL4PLmiwWYTiWsIsuZlcdBZgeLZhJA-hen3IhooEMT9Vv4AZzaLwxr_v8I0XBRr0Y0D4N40M6fEAsy75CXtBlk9Sb3fs5ydlkdtmf9riEroGObR--ZV4X7ogBn-UkljM1-1l4tfg0hcYrpOqvILGoE4mVL-QVeINy1VUOjHCFXdh1P7-krESjM4RjgMZ_UUgPWzOi9e1qPdKazVutemmvZKOcjbDBCVpsMSnQsuJRch4OLTbUWKuOBQmAIkOdL9x5yaIlpIxnwYbHIJqN0ZFBNCqnQ",
  ),
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}
?>