package kz.aitu.nca.services;

import java.io.FileInputStream;
import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.PrivateKey;
import java.security.Provider;
import java.security.Signature;
import java.security.SignatureException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertStore;
import java.security.cert.CertStoreException;
import java.security.cert.CertificateEncodingException;
import java.security.cert.CertificateException;
import java.security.cert.CertificateExpiredException;
import java.security.cert.CertificateNotYetValidException;
import java.security.cert.CollectionCertStoreParameters;
import java.security.cert.X509CertSelector;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collection;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import kz.gov.pki.kalkan.asn1.DERObjectIdentifier;
import kz.gov.pki.kalkan.asn1.DERSet;
import kz.gov.pki.kalkan.asn1.cms.Attribute;
import kz.gov.pki.kalkan.asn1.cms.AttributeTable;
import kz.gov.pki.kalkan.asn1.ess.ESSCertIDv2;
import kz.gov.pki.kalkan.asn1.ess.SigningCertificateV2;
import kz.gov.pki.kalkan.asn1.knca.KNCAObjectIdentifiers;
import kz.gov.pki.kalkan.asn1.pkcs.PKCSObjectIdentifiers;
import kz.gov.pki.kalkan.jce.provider.cms.CMSException;
import kz.gov.pki.kalkan.jce.provider.cms.CMSProcessable;
import kz.gov.pki.kalkan.jce.provider.cms.CMSProcessableByteArray;
import kz.gov.pki.kalkan.jce.provider.cms.CMSSignedData;
import kz.gov.pki.kalkan.jce.provider.cms.CMSSignedDataGenerator;
import kz.gov.pki.kalkan.jce.provider.cms.SignerInformation;
import kz.gov.pki.kalkan.jce.provider.cms.SignerInformationStore;

public class CMSService {

  private PrivateKey privateKey;
  private X509Certificate certificate;
  private Provider provider;

  public CMSService(String path, char[] password, Provider provider) {
    try {
      this.provider = provider;
      KeyStore keyStore = KeyStore.getInstance("PKCS12", provider);
      keyStore.load(new FileInputStream(path), password);
      Enumeration<String> aliases = keyStore.aliases();
      String alias = null;
      if (aliases.hasMoreElements()) {
        alias = aliases.nextElement();
      }
      privateKey = (PrivateKey) keyStore.getKey(alias, password);
      certificate = (X509Certificate) keyStore.getCertificate(alias);
    } catch (KeyStoreException | UnrecoverableKeyException | NoSuchAlgorithmException | CertificateException | IOException e) {
      e.printStackTrace();
    }
  }


  public CMSSignedData createCAdES(byte[] data) throws NoSuchAlgorithmException, InvalidAlgorithmParameterException, CertificateEncodingException, CertStoreException, CMSException, NoSuchProviderException {

    String digestOid;
    List<X509Certificate> selfChain = new ArrayList<>();
    selfChain.add(certificate);
    CertStore chainStore = CertStore.getInstance("Collection", new CollectionCertStoreParameters(selfChain),
        provider);

    if (certificate.getSigAlgOID().equals(PKCSObjectIdentifiers.sha256WithRSAEncryption.getId())) {
      digestOid = CMSSignedDataGenerator.DIGEST_SHA256;
    } else if (certificate.getSigAlgOID().equals(KNCAObjectIdentifiers.gost34311_95_with_gost34310_2004.getId())) {
      digestOid = CMSSignedDataGenerator.DIGEST_GOST34311_95;
    } else {
      throw new IllegalArgumentException("Unknown algorithm");
    }

    // CAdES-BES
    Hashtable<DERObjectIdentifier, Attribute> ht = new Hashtable<>();
    ESSCertIDv2 essCertIDv2 = new ESSCertIDv2(null,
        MessageDigest.getInstance("SHA-256", provider).digest(certificate.getEncoded()));
    SigningCertificateV2 signingCertificateV2 = new SigningCertificateV2(new ESSCertIDv2[] { essCertIDv2 });
    Attribute sigCertAttr = new Attribute(PKCSObjectIdentifiers.id_aa_signingCertificateV2,
        new DERSet(signingCertificateV2));
    ht.put(sigCertAttr.getAttrType(), sigCertAttr);

    AttributeTable sAttrTable = new AttributeTable(ht);

    CMSSignedDataGenerator generator = new CMSSignedDataGenerator();
    generator.addSigner(privateKey, certificate, digestOid, sAttrTable, null);
    generator.addCertificatesAndCRLs(chainStore);

    CMSProcessable content = new CMSProcessableByteArray(data);
    // true - encapsulates the content
    CMSSignedData signedData = generator.generate(content, true, provider.getName());

    return signedData;
  }


  public void verifyCMS(byte[] data) throws CertificateExpiredException, CertificateNotYetValidException, CMSException, NoSuchAlgorithmException, NoSuchProviderException, CertStoreException, CertificateEncodingException
  {
    CMSSignedData cms = new CMSSignedData(data);

    SignerInformationStore signers = cms.getSignerInfos();
    CertStore certs = cms.getCertificatesAndCRLs("Collection", provider.getName());
    Iterator<?> it = signers.getSigners().iterator();

    if (!it.hasNext()) {
      throw new CMSException("Signers not found!");
    }

    while (it.hasNext()) {
      SignerInformation signer = (SignerInformation) it.next();
      X509CertSelector signerConstraints = signer.getSID();
      Collection<?> certCollection = certs.getCertificates(signerConstraints);
      Iterator<?> certIt = certCollection.iterator();
      X509Certificate cert = null;

      if (certIt.hasNext()) {
        cert = (X509Certificate) certIt.next();
        if (!signer.verify(cert, provider.getName())) {
          throw new CMSException("Signature verification failure!");
        }
        // mandatory(!) certificate verification >>>
        // https://gist.github.com/as1an/8533a5c3f9ae9787de50a44457b242b8
      } else {
        throw new CMSException("Signing certificate not found!");
      }
      // additional certificate's hash verification
      AttributeTable sat = signer.getSignedAttributes();
      Attribute sigCertV2Attr = sat.get(PKCSObjectIdentifiers.id_aa_signingCertificateV2);
      if (sigCertV2Attr != null) {
        SigningCertificateV2 sigCertV2 = SigningCertificateV2
          .getInstance(sigCertV2Attr.getAttrValues().getObjectAt(0));
        ESSCertIDv2 essCertIDv2 = sigCertV2.getCerts()[0];
        byte[] certHash = MessageDigest
          .getInstance(essCertIDv2.getHashAlgorithm().getObjectId().getId(), provider)
          .digest(cert.getEncoded());
        if (!Arrays.equals(certHash, essCertIDv2.getCertHash())) {
          throw new CMSException("Signing certificate not equal!");
        }
      }
    }
  }

  
  /**
   *
   *
   * @param raw
   * @return cms
   * @throws NoSuchProviderException
   * @throws InvalidAlgorithmParameterException
   * @throws CMSException
   * @throws CertStoreException
   * @throws InvalidKeyException
   * @throws SignatureException
   * @throws IOException
   */
  public String sign(byte[] raw)
      throws KeyStoreException, UnrecoverableKeyException, NoSuchAlgorithmException, InvalidAlgorithmParameterException, NoSuchProviderException, CertStoreException, CMSException, IOException, InvalidKeyException, SignatureException
    {
      CMSSignedDataGenerator gen = new CMSSignedDataGenerator();

      Signature sig;
      sig = Signature.getInstance(certificate.getSigAlgName(), provider); // kalkanprovider
      sig.initSign(privateKey);
      sig.update(raw);


      CMSProcessableByteArray cmsData = new CMSProcessableByteArray(raw);
      CertStore chainStore = CertStore.getInstance("Collection", new CollectionCertStoreParameters(Collections.singletonList(certificate)), provider.getName());
      gen.addSigner(privateKey, certificate, getDigestAlgorithmOidBYSignAlgorithmOid(certificate.getSigAlgOID()));
      gen.addCertificatesAndCRLs(chainStore);

      CMSSignedData signed = gen.generate(cmsData, true, provider.getName());

      return new String(Base64.getEncoder().encode(signed.getEncoded()));
    }


  /**
   *
   *
  public void verify(CMSSignedData cms, String signedData) {
    SignerInformationStore signers = cms.getSignerInfos();
    boolean isSignatureValid = true;
    String providerName = provider.getName();
    CertStore clientCerts = cms.getCertificatesAndCRLs("Collection", providerName);

    Map<String, Object> resp = new HashMap<>();

    Iterator<?> sit = signers.getSigners().iterator();

    X509Certificate cert = null;

    boolean signInfo = false;

    while (sit.hasNext()) {
      signInfo = true;

      SignerInformation signer = (SignerInformation) sit.next();
      X509CertSelector signerConstraints = signer.getSID();
      Collection<?> certCollection = clientCerts.getCertificates(signerConstraints);
      Iterator<?> certIt = certCollection.iterator();

      boolean certCheck = false;

      while (certIt.hasNext()) {
        certCheck = true;
        cert = (X509Certificate) certIt.next();
        cert.checkValidity();
        if (!signer.verify(cert.getPublicKey(), providerName)) {
          isSignatureValid = false;
        }
      }

      if (!certCheck) {
        throw new Exception("Certificate not found");
      }
    }
    resp.put("valid", isSignatureValid);

    if (!signInfo) {
      throw new Exception("SignerInformation not found");
    }

    // Chain information
    ArrayList<java.security.cert.X509Certificate> chain;
  }
  */


  /**
   * Возвращает алгоритм хэширования по алгоритму подписи
   *
   * @param signOid sign OID
   * @return digest algorithm OID
   */
  public static String getDigestAlgorithmOidBYSignAlgorithmOid(String signOid) {
    if (signOid.equals(PKCSObjectIdentifiers.sha1WithRSAEncryption.getId())) {
      return CMSSignedDataGenerator.DIGEST_SHA1;
    }
    else if (signOid.equals(PKCSObjectIdentifiers.sha256WithRSAEncryption.getId())) {
      return CMSSignedDataGenerator.DIGEST_SHA256;
    }
    else {
      return CMSSignedDataGenerator.DIGEST_GOST34311_95;
    }
  }
}
