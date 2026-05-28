import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const urls: [string, string][] = [
  ['pearl', 'https://scontent.fpnh5-2.fna.fbcdn.net/v/t51.71878-10/628036726_1426044232505834_7016877405478789163_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=50ce42&_nc_ohc=a1C_pMexv5UQ7kNvwGzFnUJ&_nc_oc=Adp0acxRUDbXeiTjd5IxTpikw276heWTKJYT8l-d3qK_er29IZmU606Q89zoDioKS9s&_nc_zt=23&_nc_ht=scontent.fpnh5-2.fna&_nc_gid=4ivZZLhnBH5yxWN-bichSw&_nc_ss=7f289&oh=00_Af6ds5ZmrSWMzffRAf-udLjWAd-PeuW-vlr-gafXKTiYkg&oe=6A1BB76B'],
  ['easter', 'https://scontent.fpnh5-3.fna.fbcdn.net/v/t51.71878-10/628594096_1439220204408719_3461567154290980693_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=50ce42&_nc_ohc=YM1zd5c1zLUQ7kNvwGCSNWQ&_nc_oc=AdqXf0OsCBLuDajswCyENvM8avNSmkxNp8hY-QtH9tZjFBIvbxITpHrxfMTztHN9lMs&_nc_zt=23&_nc_ht=scontent.fpnh5-3.fna&_nc_gid=4ivZZLhnBH5yxWN-bichSw&_nc_ss=7f289&oh=00_Af58vtmDz0QAKfQo2qepAWxh2Q6I8v1iULaAkD4IqbkT1A&oe=6A1BC93D'],
  ['correctie', 'https://scontent.fpnh5-2.fna.fbcdn.net/v/t51.71878-10/622968517_1221780352748435_5358579542058502588_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=50ce42&_nc_ohc=P-ZlJYRHUvEQ7kNvwGQ0jN6&_nc_oc=AdqXNjGtbUWDAhRJpFQEDuda-xcc_Bfh9jPrGfx10RBCr8bjp6oNYHinuPvsvOKzkbM&_nc_zt=23&_nc_ht=scontent.fpnh5-2.fna&_nc_gid=4ivZZLhnBH5yxWN-bichSw&_nc_ss=7f289&oh=00_Af49B6uUVHEfuvjZ2PZSSlIjLZ59T_FmmEt9zFM4gguwaw&oe=6A1BA34B'],
  ['xmas', 'https://scontent.fpnh5-3.fna.fbcdn.net/v/t51.71878-10/590411970_1369189094934172_3629330324439428661_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=50ce42&_nc_ohc=8GfMkATP5qEQ7kNvwFeQDpj&_nc_oc=AdrP85XS_SFalBUXTI6wpErbrx-G6Ivs0ZFW56ypJ_9b7duNc8wqp6pSgH2GYFEkGH0&_nc_zt=23&_nc_ht=scontent.fpnh5-3.fna&_nc_gid=4ivZZLhnBH5yxWN-bichSw&_nc_ss=7f289&oh=00_Af5TYsIFbVxngg4xidjJU4XKoC76u9C8hFzKAbw3-yr3yA&oe=6A1BA5B6'],
  ['custom', 'https://scontent.fpnh5-3.fna.fbcdn.net/v/t51.71878-10/590939618_1548912779588481_1088304785721660119_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=50ce42&_nc_ohc=Jq4WE-qZvEIQ7kNvwGQNKaQ&_nc_oc=Adpq4H_Im1igohzhmlSt1_Vpr_Lve4nMDkuVjPYeSdhrFL-YtcewrElw0tNLYLhtNnI&_nc_zt=23&_nc_ht=scontent.fpnh5-3.fna&_nc_gid=4ivZZLhnBH5yxWN-bichSw&_nc_ss=7f289&oh=00_Af6iVF2fjSdfToUNVAU_-P5BwXmL9CmovCG7GCIDpAVDnA&oe=6A1B9612'],
  ['french', 'https://scontent.fpnh5-2.fna.fbcdn.net/v/t51.71878-10/588606107_1365845681791582_1178080684359684322_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=50ce42&_nc_ohc=cLrB359Eo98Q7kNvwEVwK4b&_nc_oc=AdqL8Agto-agTtBNKWe971lDcQ31AP0gfAXainFKdogPhsbGXZQFSOUXP1oxtbxaCIw&_nc_zt=23&_nc_ht=scontent.fpnh5-2.fna&_nc_gid=4ivZZLhnBH5yxWN-bichSw&_nc_ss=7f289&oh=00_Af40LtWZ6jVPbv0PouHm9kTDHLxhYcZ9OIqhu2Efyv4VkQ&oe=6A1B9C3A'],
  ['frenchies', 'https://scontent.fpnh5-3.fna.fbcdn.net/v/t51.71878-10/587887041_1472894448178100_2362638948275928343_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=50ce42&_nc_ohc=36YWjz98kF8Q7kNvwFsDxEn&_nc_oc=AdrP_JPJ0Zrt1CKizasKS0FRlg2SLy3IyupUb_kfTSDbiDJfUHXCZsPxDvAHNpqyvCo&_nc_zt=23&_nc_ht=scontent.fpnh5-3.fna&_nc_gid=4ivZZLhnBH5yxWN-bichSw&_nc_ss=7f289&oh=00_Af5MYBMX2h5J9WnyM9wGtfjafbYXxxvq3ddq7s2rmkRxKQ&oe=6A1BA9D0'],
  ['magnetic', 'https://scontent.fpnh5-2.fna.fbcdn.net/v/t51.71878-10/587781245_844522741742347_5080648484950232157_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=107&ccb=1-7&_nc_sid=50ce42&_nc_ohc=HfjK9atZdYoQ7kNvwEiZHky&_nc_oc=AdqfZc_4L787PBxCHd0Vt3tJHdIUqpD5EKfgdG0bIR-FkfgloWR5tGNgV4rsIdpqAkY&_nc_zt=23&_nc_ht=scontent.fpnh5-2.fna&_nc_gid=4ivZZLhnBH5yxWN-bichSw&_nc_ss=7f289&oh=00_Af7zAmzjg6OL4eNt8npfStM_Ckiy0DG9NhxFSaEyrMiSxA&oe=6A1BA0D7'],
];

async function main() {
  await Promise.all(
    urls.map(async ([id, url]) => {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          console.log('fail', id, res.status);
          return;
        }
        const buf = Buffer.from(await res.arrayBuffer());
        await writeFile(path.join('public', `reel-${id}.jpg`), buf);
        console.log('ok', id, buf.length);
      } catch (e) {
        console.log('err', id, String(e));
      }
    }),
  );
}

main();
